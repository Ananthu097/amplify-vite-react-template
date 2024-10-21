import React, { useEffect, useState } from "react";
import { Auth } from 'aws-amplify';
import { generateClient } from "aws-amplify/data"; // Adjust imports as necessary
import type { Schema } from "../amplify/data/resource"; // Adjust according to your setup

const client = generateClient<Schema>();

interface TodoListProps {
  user: any; // Define a more specific type based on your user structure
}

const TodoList: React.FC<TodoListProps> = ({ user }) => {
  const [todos, setTodos] = useState<Array<any>>([]); // Define the specific type for your todos

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: async (data) => {
        const userTodos = data.items.filter(todo => todo.owner === user.username);
        setTodos([...userTodos]);
      },
    });

    return () => subscription.unsubscribe(); // Clean up on unmount
  }, [user]);

  const createTodo = async () => {
    const content = window.prompt("Todo content");
    if (content) {
      await client.models.Todo.create({ content, completed: false, owner: user.username });
    }
  };

  const toggleCompletion = async (todo: any) => {
    await client.models.Todo.update({ id: todo.id, completed: !todo.completed });
  };

  const deleteTodo = async (todo: any) => {
    await client.models.Todo.delete(todo.id);
  };

  return (
    <div>
      <button onClick={createTodo}>+ New Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span onClick={() => toggleCompletion(todo)} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.content}
            </span>
            <button onClick={() => deleteTodo(todo)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
