import React, { useState } from "react";
import { Auth } from 'aws-amplify';

interface AuthProps {
  onLogin: () => void;
}

const AuthComponent: React.FC<AuthProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSignIn = async () => {
    try {
      await Auth.signIn(username, password);
      onLogin();
    } catch (error) {
      console.error('Error signing in', error);
    }
  };

  const handleSignUp = async () => {
    try {
      await Auth.signUp({ username, password });
      alert('Sign up successful! Please log in.');
    } catch (error) {
      console.error('Error signing up', error);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignUp}>Sign Up</button>

      <h2>Sign In</h2>
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
};

export default AuthComponent;

