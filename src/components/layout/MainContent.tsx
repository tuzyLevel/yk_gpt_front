"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { MdAttachFile } from "react-icons/md";
import { VscSend } from "react-icons/vsc";

import '@/styles/markdown.css';


import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type MainContentProps = React.PropsWithChildren & {
  currentChat: Chat | null;
  sendChatHandler: (message: string) => void;
};

export default function MainContent({
  currentChat,
  sendChatHandler,
}: MainContentProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      sendChatHandler(message);
      setMessage("");
    }
  };

  // textarea 높이 자동 조절
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.scrollTop = textarea.scrollHeight;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const ICON_SIZE = 40;

  return (
    <div className="flex flex-col flex-1 items-center max-h-dvh bg-[#1f2021ff]">
      <Navbar />
      <div className="flex flex-col w-full h-full overflow-hidden">
        <div className="flex flex-1 items-start justify-center p-4 transition-all duration-300 ease-in-out overflow-y-auto">
          {/* Chat interface will go here */}
          {currentChat && (
            <div className={`flex flex-col w-[80%]`}>
              {currentChat.chatLines.map((chatline, index) => (
                <div
                  key={`${index}`}
                  className={`flex w-full ${
                    chatline.writer === "AI" ? "justify-start" : "justify-end"
                  } p-4`}
                >
                  
                  <div
                    className={`rounded-lg p-2 ${
                      chatline.writer !== "AI" ? "bg-zinc-600" : "markdown-container"
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {chatline.message}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center items-center w-full">
          <div
            id="message-input"
            className="flex items-end max-h-40 max-w-[600px] w-[600px] border border-white rounded-xl shrink-0 p-2"
          >
            <MdAttachFile
              size={ICON_SIZE}
              className="shrink-0 cursor-pointer hover:opacity-80"
            />
            <div className="flex-1 flex justify-center flex-col mx-2 min-h-[40px]">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent resize-none outline-none leading-6 overflow-y-auto min-h-[40px] max-h-[120px] text-base py-2"
                placeholder="메시지를 입력하세요..."
                rows={1}
              />
            </div>
            <VscSend
              size={ICON_SIZE}
              className={`shrink-0 cursor-pointer hover:opacity-80 ${
                message.trim() ? "text-blue-500" : "text-gray-400"
              }`}
              onClick={()=>{
                sendChatHandler(message);
                setMessage("");
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
