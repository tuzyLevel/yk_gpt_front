"use client";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { MdAttachFile } from "react-icons/md";
import { VscSend } from "react-icons/vsc";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type MessageInputProps = React.PropsWithChildren & {
  sendChatHandler: (message: string) => void;
};

export default function MessageInput({ sendChatHandler }: MessageInputProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [message, setMessage] = useState("");

  // 아이콘 크기를 화면 크기에 따라 조정
  const ICON_SIZE = {
    mobile: 33.6,
    desktop: 41.6,
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // textarea 높이 자동 조절
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const baseHeight = isMobile ? 33.6 : 41.6;
      const newHeight = Math.max(textarea.scrollHeight, baseHeight);
      textarea.style.height = `${Math.min(newHeight, 120)}px`; // 최대 높이 120px로 제한

      // 스크롤을 항상 아래로 유지
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [isMobile]);

  const onClickSendButtonHandler = () => {
    if (!message.trim()) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        title: "メッセージを入力してください。",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    sendChatHandler(message);
    setMessage("");
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      onClickSendButtonHandler();
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message, isMobile, adjustTextareaHeight]);

  return (
    <div
      id="message-input"
      className="flex items-end w-[90%] lg:w-[640px] border border-white rounded-xl shrink-0 p-1 md:p-2"
    >
      <MdAttachFile
        size={isMobile ? ICON_SIZE.mobile : ICON_SIZE.desktop}
        className={`shrink-0 cursor-pointer hover:opacity-80 ml-1`}
      />
      <div className="flex-1 flex justify-center mx-1">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border rounded-md w-full bg-transparent resize-none outline-none overflow-y-auto px-1 py-1 md:py-2 lg:py-2 text-base"
          placeholder="メッセージを入力してください"
          rows={1}
        />
      </div>
      <button
        className={`shrink-0 cursor-pointer mr-1 md:mr-2 ${
          message.trim() ? "text-blue-500" : "text-gray-400"
        }`}
        onClick={onClickSendButtonHandler}
      >
        <VscSend size={isMobile ? ICON_SIZE.mobile : ICON_SIZE.desktop} />
      </button>
    </div>
  );
}
