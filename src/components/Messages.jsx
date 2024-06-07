import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (!data.chatId) {
      console.error("Chat ID is not defined");
      return;
    }

    const unSub = onSnapshot(
      doc(db, "chats", data.chatId),
      (doc) => {
        if (doc.exists()) {
          setMessages(doc.data().messages);
        } else {
          console.error("No such document!");
        }
      },
      (error) => {
        console.error("Error in snapshot listener:", error);
      }
    );

    return () => {
      unSub();
    };
  }, [data.chatId]);

  console.log(messages);

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
