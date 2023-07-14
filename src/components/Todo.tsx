import {
  Heading,
  View,
  Button,
  useTheme,
  Flex,
  CheckboxField,
} from "@aws-amplify/ui-react";
import { Todo } from "@/API";
import { ChangeEvent } from "react";

export function TodoViewer({
  todos,
  removeTodo,
  markCompletedTodo,
}: {
  todos: Todo[];
  removeTodo: (id: string, _version: number) => void;
  markCompletedTodo: (id: string, completed: boolean, version: number) => void;
}) {
  const { tokens } = useTheme();

  const setMarkCompleted = (
    e: ChangeEvent<HTMLInputElement>,
    id: string,
    version: number
  ) => {
    markCompletedTodo(id, e.target.checked, version);
  };

  return (
    <>
      <Heading level={3}>List of Todos</Heading>

      {todos?.map((todo) => (
        <View
          width={"100%"}
          color={tokens.colors.brand.primary[100]}
          marginTop={"1rem"}
          padding="1rem"
          borderRadius={"1rem"}
          border={"1px solid green"}
          key={todo?.id}
          textDecoration={todo?.completed ? "line-through" : ""}
        >
          <Button
            variation={"destructive"}
            onClick={() => removeTodo(todo?.id, todo?._version)}
          >
            x
          </Button>

          <Flex
            fontSize={"larger"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <CheckboxField
              name="completed"
              value="completed"
              label={"completed"}
              onChange={(e) => setMarkCompleted(e, todo?.id, todo?._version)}
              checked={todo?.completed!}
            />

            <View>Title:</View>
            <View fontWeight={"extrabold"}>{todo?.title}</View>
          </Flex>
        </View>
      ))}
    </>
  );
}
