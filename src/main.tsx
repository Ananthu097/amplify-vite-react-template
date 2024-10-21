import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import './App.css'; // Ensure your CSS is imported

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    return () => subscription.unsubscribe(); // Clean up subscription on unmount
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content, completed: false });
    }
  }

  function toggleCompletion(todo) {
    client.models.Todo.update({ id: todo.id, completed: !todo.completed });
  }

  function deleteTodo(todo) {
    client.models.Todo.delete(todo.id);
  }

  function editTodo(todo) {
    const newContent = window.prompt("Edit todo content", todo.content);
    if (newContent) {
      client.models.Todo.update({ id: todo.id, content: newContent });
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true; // all
  });

  return (
    <main id="root">
      <h1>My Todos</h1>
      <button onClick={createTodo}>+ New Todo</button>
      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
      </div>
      <div className="card">
        <ul>
          {filteredTodos.map((todo) => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <span onClick={() => toggleCompletion(todo)}>{todo.content}</span>
              <button onClick={() => editTodo(todo)}>Edit</button>
              <button onClick={() => deleteTodo(todo)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default App;
