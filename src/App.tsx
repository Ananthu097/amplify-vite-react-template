import React, { useState, useEffect } from "react";
import { Auth } from 'aws-amplify';
import TodoList from './components/TodoList';
import AuthComponent from './components/Auth';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null); // You can define a more specific type based on your user structure

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      }
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    await Auth.signOut();
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome, {user.username}</h1>
          <button onClick={handleLogout}>Logout</button>
          <TodoList user={user} />
        </>
      ) : (
        <AuthComponent onLogin={() => setUser(true)} />
      )}
    </div>
  );
};

export default App;
