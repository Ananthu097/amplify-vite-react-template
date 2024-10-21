import React, { useEffect, useState } from "react";
import { Auth } from 'aws-amplify';
import { generateClient } from "aws-amplify/data"; // Ensure the correct import
import type { Schema } from "../amplify/data/resource"; // Adjust according to your setup

const client = generateClient<Schema>();

interface ChatListProps {
  user: any; // Define a more specific type based on your user structure
}

const ChatList: React.FC<ChatListProps> = ({ user }) => {
  const [chats, setChats] = useState<Array<any>>([]); // Adjust type as needed

  useEffect(() => {
    const subscription = client.models.Chat.observeQuery().subscribe({
      next: async (data) => {
        const userChats = data.items.filter(chat => chat.owner === user.username);
        setChats([...userChats]);
      },
    });

    return () => subscription.unsubscribe(); // Clean up on unmount
  }, [user]);

  const createChat = async () => {
    const message = window.prompt("Chat message");
    if (message) {
      await client.models.Chat.create({ message, owner: user.username });
    }
  };

  const deleteChat = async (chat: any) => {
    await client.models.Chat.delete(chat.id);
  };

  return (
    <div>
      <button onClick={createChat}>+ New Chat</button>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id}>
            <span>{chat.message}</span>
            <button onClick={() => deleteChat(chat)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
