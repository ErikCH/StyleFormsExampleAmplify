import {
  Card,
  ColorMode,
  Flex,
  Heading,
  ToggleButton,
  ToggleButtonGroup,
} from "@aws-amplify/ui-react";
import TodoForm from "@/ui-components/TodoCreateForm";
import { API, graphqlOperation } from "aws-amplify";
import { GraphQLQuery, GraphQLSubscription } from "@aws-amplify/api";
import {
  ListTodosQuery,
  OnCreateTodoSubscription,
  Todo,
  DeleteTodoInput,
  DeleteTodoMutation,
  OnDeleteTodoSubscription,
  UpdateTodoMutation,
  UpdateTodoInput,
  OnUpdateTodoSubscription,
} from "@/API";
import { listTodos } from "@/graphql/queries";
import {
  onCreateTodo,
  onDeleteTodo,
  onUpdateTodo,
} from "@/graphql/subscriptions";
import { deleteTodo, updateTodo } from "@/graphql/mutations";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "./_app";
import { TodoViewer } from "@/components/Todo";

export default function Home() {
  const [todos, setTodo] = useState<Todo[]>([]);

  const getTodos = async () => {
    const allTodos = await API.graphql<GraphQLQuery<ListTodosQuery>>({
      query: listTodos,
    });
    const filteredTodos = allTodos.data?.listTodos?.items.filter(
      (todo) => !todo?._deleted
    );
    setTodo(filteredTodos as Todo[]);
  };
  const { setColorMode, colorMode } = useContext(ThemeContext);

  useEffect(() => {
    console.log("running");
    getTodos();
    const sub = API.graphql<GraphQLSubscription<OnCreateTodoSubscription>>(
      graphqlOperation(onCreateTodo)
    ).subscribe({
      next: ({ provider, value }) => {
        console.log("create");
        setTodo((prevValue) => [
          ...prevValue,
          value.data?.onCreateTodo as Todo,
        ]);
        console.log({ provider, value });
      },
      error: (error) => console.warn(error),
    });

    const del = API.graphql<GraphQLSubscription<OnDeleteTodoSubscription>>(
      graphqlOperation(onDeleteTodo)
    ).subscribe({
      next: ({ provider, value }) => {
        console.log("delete");
        setTodo((prevValue) => {
          const filteredValue = prevValue.filter(
            (todo) => todo.id !== value.data?.onDeleteTodo?.id
          );
          return filteredValue;
        });
        console.log({ provider, value });
      },
      error: (error) => console.warn(error),
    });

    const update = API.graphql<GraphQLSubscription<OnUpdateTodoSubscription>>(
      graphqlOperation(onUpdateTodo)
    ).subscribe({
      next: ({ provider, value }) => {
        console.log("update");
        setTodo((prevValue) => {
          const filteredValue = prevValue.map((todo) => {
            if (todo?.id === value.data?.onUpdateTodo?.id) {
              return value.data.onUpdateTodo;
            } else return todo;
          });
          return filteredValue;
        });
        console.log({ provider, value });
      },
      error: (error) => console.warn(error),
    });

    return () => {
      sub.unsubscribe();
      del.unsubscribe();
      update.unsubscribe();
    };
  }, []);

  const markCompletedTodo = async (
    id: string,
    completed: boolean,
    _version: number
  ) => {
    console.log("marking completed", id, completed);

    const todoDetails: UpdateTodoInput = {
      id,
      completed,
      _version,
    };
    console.log("todoDetails", todoDetails);

    await API.graphql<GraphQLQuery<UpdateTodoMutation>>({
      query: updateTodo,
      variables: { input: todoDetails },
    });
  };

  const removeTodo = async (id: string, _version: number) => {
    console.log("removing", id);
    const todoDetails: DeleteTodoInput = {
      id,
      _version,
    };

    await API.graphql<GraphQLQuery<DeleteTodoMutation>>({
      query: deleteTodo,
      variables: { input: todoDetails },
    });
  };

  return (
    <Flex direction={"column"} alignItems={"center"}>
      <Heading level={1}>Todo Form</Heading>
      <Card borderRadius={"1rem"} padding="0" width="25%">
        <Flex
          direction={"column"}
          alignItems={"center"}
          gap={"1rem"}
          padding="1rem"
        >
          <ToggleButtonGroup
            value={colorMode}
            isExclusive
            onChange={(value) => setColorMode(value as ColorMode)}
          >
            <ToggleButton value="light">Light</ToggleButton>
            <ToggleButton value="dark">Dark</ToggleButton>
            <ToggleButton value="system">System</ToggleButton>
          </ToggleButtonGroup>
          <TodoForm
            width="100%"
            border={"1px solid black"}
            borderRadius={"1rem"}
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
          />
          <TodoViewer
            markCompletedTodo={markCompletedTodo}
            todos={todos}
            removeTodo={removeTodo}
          />
        </Flex>
      </Card>
    </Flex>
  );
}
