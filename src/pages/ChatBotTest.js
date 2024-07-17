import React, { useEffect, useRef } from "react";
import { botConfig2 } from "../components/chabot/data";

function ChatBotTest() {
  const wrapper = useRef();

  useEffect(() => {
    const bot = new window.ChatSDK({
      root: wrapper.current,
      popContainer: wrapper.current,
      ...botConfig2,
    });
    bot.run();
  }, []);

  return <div style={{ height: "100%" }} ref={wrapper} />;
}

export default ChatBotTest;
