// App.jsx
import React, { useEffect } from "react";
import Chat, { Bubble, useMessages } from "@chatui/core";
import "@chatui/core/dist/index.css";
import "../assets/styles/chatui-theme.css";
import CardComponent from "../components/chabot/CardComponent";
import {
  initialMessages,
  defaultQuickReplies,
} from "../components/chabot/data";

const Chatbot = () => {
  const { messages, appendMsg, setTyping } = useMessages(initialMessages);

  function handleSend(type, val) {
    if (type === "text" && val.trim()) {
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
      });

      setTyping(true);

      setTimeout(() => {
        appendMsg({
          type: "text",
          content: { text: "Hi I'm here! What can I help you?" },
        });
      }, 1000);
    }
  }

  function handleQuickReplyClick(item) {
    handleSend("text", item.name);
  }

  function renderMessageContent(msg) {
    const { type, content } = msg;

    switch (type) {
      case "text":
        return <Bubble content={content.text} />;
      case "image":
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        );
      case "card":
        return <CardComponent content={content} />;
      default:
        return null;
    }
  }

  return (
    <Chat
      navbar={{ title: "Finance AI Bot" }}
      locale="en-US"
      messages={messages}
      renderMessageContent={renderMessageContent}
      quickReplies={defaultQuickReplies}
      onQuickReplyClick={handleQuickReplyClick}
      onSend={handleSend}
    />
  );
};

export default Chatbot;
