import {
  Alert,
  Button,
  Card,
  Collection,
  ColorMode,
  Flex,
  Heading,
  Text,
  ToggleButton,
  ToggleButtonGroup,
  View,
  useTheme,
} from "@aws-amplify/ui-react";
import TodoForm from "@/ui-components/TodoCreateForm";
import { API } from "aws-amplify";
import { GraphQLQuery, GraphQLResult } from "@aws-amplify/api";
import { ListTodosQuery } from "@/API";
import { listTodos } from "@/graphql/queries";
import { FormEvent, useState } from "react";
import { Todo } from "@/models";

export default function Home() {
  const [todos, setTodo] =
    useState<GraphQLResult<GraphQLQuery<ListTodosQuery>>>();
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const allTodos = await API.graphql<GraphQLQuery<ListTodosQuery>>({
      query: listTodos,
    });
    setTodo(allTodos);
  };

  const { tokens } = useTheme();

  return (
    <Flex direction="row" height="100%" width="100%" justifyContent="stretch" gap="0">
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
                if (value.length === 0) {
                  return {
                    hasError: true,
                    errorMessage: "NOT GOOD!",
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
          {showSuccess && (
            <Alert variation="success">
              Todo added!
            </Alert>
          )}

        </Flex>
        <Flex direction="column" flex="1" padding="xxl" backgroundColor="background.secondary">
          <Heading level={3}>List of Todos</Heading>

          <View as="form" onSubmit={onSubmit}>
            <Button type="submit">Show Todos</Button>
            <Collection
              gap="small"
              items={todos?.data?.listTodos?.items || []}
            >
              {(todo: Todo) => (
                <Card
                  variation="elevated"
                  color={tokens.colors.brand.primary[100]}
                  marginTop={"1rem"}
                  padding="1rem"
                  key={todo?.id}
                  textDecoration={todo?.completed ? "line-through" : ""}
                >
                {todo?.title}
              </Card>
              )}
            </Collection>
          </View>
        </Flex>
    </Flex>
  );
}
