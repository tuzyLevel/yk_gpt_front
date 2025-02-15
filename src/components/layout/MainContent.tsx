"use client";
import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import "@/styles/markdown.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MessageInput from "@/components/layout/MessageInput";

type MainContentProps = React.PropsWithChildren & {
  currentChat: Chat | null;
  sendChatHandler: (message: string) => void;
};

export default function MainContent({
  currentChat,
  sendChatHandler,
}: MainContentProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [currentChat?.chatLines]);

  return (
    <div className="w-full flex flex-col flex-1 items-center max-h-dvh">
      <Navbar />
      <div className="flex flex-col w-full h-full overflow-hidden">
        <div
          ref={chatContainerRef}
          className="flex flex-1 items-center justify-center p-4 transition-all duration-300 ease-in-out overflow-y-auto"
        >
          {/* Chat interface will go here */}
          {currentChat && (
            <div className={`flex flex-col w-full max-w-3xl mx-auto h-full`}>
              {currentChat.chatLines.map((chatline, index) => (
                <div
                  key={`${index}`}
                  className={`flex w-full ${
                    chatline.writer === "AI" ? "justify-start" : "justify-end"
                  } p-4`}
                >
                  {chatline.message && (
                    <div
                      className={`rounded-lg p-2 ${
                        chatline.writer !== "AI"
                          ? "whitespace-pre-wrap"
                          : "w-full markdown-container"
                      }`}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {chatline.message}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          id="message-input-container"
          className="flex justify-center items-center w-full"
        >
          <MessageInput sendChatHandler={sendChatHandler} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
