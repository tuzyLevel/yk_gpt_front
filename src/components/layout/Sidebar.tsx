"use client";

import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { CiStickyNote } from "react-icons/ci";
import { signOut } from "next-auth/react";

type SidebarProps = {
  chatList: Chat[];
  currentChatListIndex: number;
  setCurrentChatListIndexHandler: (chatId: string) => void;
  resetCurrentChatListIndexHandler: () => void;
  titleOnClickHandler: (chatId: string) => void;
} & React.PropsWithChildren;

export default function Sidebar({
  chatList,
  currentChatListIndex,
  // setCurrentChatListIndexHandler,
  resetCurrentChatListIndexHandler,
  titleOnClickHandler,
}: SidebarProps) {
  const [isExtended, setIsExtended] = useState<boolean>(true);

  const width = isExtended ? `w-80` : "w-16";

  const sidebarToggleHandler = () => {
    setIsExtended((prev) => !prev);
  };

  return (
    <aside
      className={`${width} bg-[#272626] h-full p-4 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out `}
    >
      <div className="flex justify-even space-y-4 border-b-2 border-white w-full h-10">
        <button onClick={sidebarToggleHandler} className="hover:scale-125">
          <RxHamburgerMenu size={24} />
        </button>
        <button onClick={() => signOut()}>Sign out</button>
        <button
          onClick={resetCurrentChatListIndexHandler}
          className="hover:scale-125"
        >
          <CiStickyNote size={24} />
        </button>
      </div>
      {isExtended && (
        <div className="flex flex-col overflow-y-auto">
          {/* Chat history items will go here */}
          {chatList.map((chat, index) => (
            <div
              className={`h-8 hover:bg-slate-500 m-1 rounded-lg py-1 px-2 hover:cursor-pointer ${
                currentChatListIndex === index ? "bg-slate-600" : ""
              }`}
              key={chat.key}
              onClick={() => titleOnClickHandler(chat.chat_id)}
            >
              {chat.title.length > 20
                ? chat.title.slice(0, 15) + "..."
                : chat.title}
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
