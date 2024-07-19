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
  // Inside Chatbot component
  const apiUrl = process.env.REACT_APP_fine_tuned_gemini_api_url + "/api/analyzer";
  async function fetchData(apiUrl, postData) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: postData }) // Correctly format the body as JSON
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
  
      const data = await response.json(); // Parse JSON data from the response
      return JSON.stringify(data.output); // Optionally, return JSON string of the data
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return "there is an error"; // Return the error message
    }
  }
  

  function handleSend(type, val) {
    if (type === "text" && val.trim()) {
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
      });
      
      setTyping(true);

      fetchData(apiUrl, val).then(replyMessage => {
        appendMsg({
            type: "text",
            content: { text: replyMessage },
            position: "left", // Assuming the bot's messages appear on the left
        });
        setTyping(false); // Turn off the typing indicator once the message is received
    }).catch(error => {
        console.error('Error fetching data:', error);
        appendMsg({
            type: "text",
            content: { text: "There was an error. Please try again." },
            position: "left",
        });
    });
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
    <div className="flex flex-row gap-2">
      <Chat
        navbar={{ title: "Finance AI Bot" }}
        locale="en-US"
        messages={messages}
        renderMessageContent={renderMessageContent}
        quickReplies={defaultQuickReplies}
        onQuickReplyClick={handleQuickReplyClick}
        onSend={handleSend}
      />
    </div>
  );
};

export default Chatbot;
