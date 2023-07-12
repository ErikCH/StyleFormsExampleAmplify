import {
  Button,
  Card,
  ColorMode,
  Flex,
  Heading,
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
import { FormEvent, useContext, useState } from "react";
import { ThemeContext } from "./_app";

export default function Home() {
  const [todos, setTodo] =
    useState<GraphQLResult<GraphQLQuery<ListTodosQuery>>>();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const allTodos = await API.graphql<GraphQLQuery<ListTodosQuery>>({
      query: listTodos,
    });
    setTodo(allTodos);
  };
  const { setColorMode, colorMode } = useContext(ThemeContext);
  const { tokens } = useTheme();

  return (
    <Flex direction={"column"} alignItems={"center"}>
      <Heading level={1}>Todo Form</Heading>
      <Card borderRadius={"1rem"} padding="0">
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
          <Heading level={3}>List of Todos</Heading>

          <View as="form" onSubmit={onSubmit}>
            <Button type="submit">Show Todos</Button>
            {todos?.data?.listTodos?.items.map((todo) => (
              <View
                color={tokens.colors.brand.primary[100]}
                marginTop={"1rem"}
                padding="1rem"
                borderRadius={"1rem"}
                border={"1px solid green"}
                key={todo?.id}
                textDecoration={todo?.completed ? "line-through" : ""}
              >
                {todo?.title}
              </View>
            ))}
          </View>
        </Flex>
      </Card>
    </Flex>
  );
}
