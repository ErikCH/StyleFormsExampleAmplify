import {
  Alert,
  Card,
  Collection,
  Flex,
  Heading,
  Text,
  useTheme,
} from "@aws-amplify/ui-react";
import TodoForm from "@/ui-components/TodoCreateForm";
import { API, graphqlOperation } from "aws-amplify";
import { GraphQLQuery, GraphQLSubscription } from "@aws-amplify/api";
import { ListTodosQuery, Todo, OnCreateTodoSubscription } from "@/API";
import { listTodos } from "@/graphql/queries";
import { onCreateTodo } from "@/graphql/subscriptions";
import { useEffect, useState } from "react";

export default function Home() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [todos, setTodo] = useState<Todo[]>([]);

  const getTodos = async () => {
    const allTodos = await API.graphql<GraphQLQuery<ListTodosQuery>>({
      query: listTodos,
    });

    const filteredTodos = allTodos.data?.listTodos?.items
      .filter((todo) => !todo?._deleted)
      .sort(
        (a, b) =>
          new Date(a?.createdAt!).getTime() - new Date(b?.createdAt!).getTime()
      );

    setTodo(filteredTodos as Todo[]);
  };

  useEffect(() => {
    getTodos();
    const sub = API.graphql<GraphQLSubscription<OnCreateTodoSubscription>>(
      graphqlOperation(onCreateTodo)
    ).subscribe({
      next: ({ provider, value }) => {
        setTodo((prevValue) => [
          ...prevValue,
          value.data?.onCreateTodo as Todo,
        ]);
      },
      error: (error) => console.warn(error),
    });

    return () => sub.unsubscribe();
  }, []);

  const { tokens } = useTheme();

  return (
    <Flex
      direction="row"
      height="100%"
      width="100%"
      justifyContent="stretch"
      gap="0"
    >
      <Flex
        direction="column"
        gap="medium"
        padding="xxl"
        backgroundColor="background.primary"
      >
        <Text>New ToDo</Text>
        <TodoForm
          padding="0"
          onValidate={{
            title: (value, validateResponse) => {
              if (value.trim().length === 0) {
                return {
                  hasError: true,
                  errorMessage: "Please enter a value!",
                };
              }
              return validateResponse;
            },
          }}
          onSuccess={() => {
            setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
            }, 2000);
          }}
        />
        {showSuccess && <Alert variation="success">Todo added!</Alert>}
      </Flex>
      <Flex
        direction="column"
        flex="1"
        padding="xxl"
        backgroundColor="background.secondary"
      >
        <Heading level={3}>List of Todos</Heading>

        <Collection gap="small" type="list" items={todos}>
          {(todo) => (
            <Card
              variation="elevated"
              color={tokens.colors.brand.primary[100]}
              marginTop="1rem"
              padding="1rem"
              key={todo.id}
              textDecoration={todo?.completed ? "line-through" : ""}
            >
              {todo?.title}
            </Card>
          )}
        </Collection>
      </Flex>
    </Flex>
  );
}
