"use client";

import React from "react";
import { LogOut, Plus } from "lucide-react";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { signOut } from "next-auth/react";
import {
  useSidebar,
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type SidebarProps = {
  chatList: Chat[];
  currentChatListIndex: number;
  setCurrentChatListIndexHandler: (chatId: string) => void;
  resetCurrentChatListIndexHandler: () => void;
  titleOnClickHandler: (chatId: string) => void;
} & React.PropsWithChildren;

export default function SidebarComponent({
  chatList,
  currentChatListIndex,
  titleOnClickHandler,
  resetCurrentChatListIndexHandler,
}: SidebarProps) {
  const { open, toggleSidebar, isMobile } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <Card className={`${!open && "w-[30px] h-[30px]"} `}>
          {open && (
            <CardHeader>
              <CardTitle className="text-center">
                YK AI Chatbot
                <VisuallyHidden>AI 채팅 애플리케이션 사이드바</VisuallyHidden>
              </CardTitle>
            </CardHeader>
          )}
          {!open && (
            <CardContent className="flex justify-between items-center p-1">
              YK
            </CardContent>
          )}
        </Card>
        <Card
          className={`${
            !open && "w-[30px] "
          } h-[30px] hover:bg-gray-800 hover:text-white`}
        >
          <CardContent className="w-full h-full flex justify-between items-center p-0">
            <button
              className="w-full h-full flex justify-evenly items-center rounded-md transition-transform duration-200"
              onClick={() => {
                resetCurrentChatListIndexHandler();
                if (isMobile) toggleSidebar();
              }}
            >
              {open ? (
                <span className="inline-block">新しい会話</span>
              ) : (
                <Plus size={16} />
              )}
            </button>
          </CardContent>
        </Card>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>会話タイトル</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {open &&
                chatList.map((chat, index) => (
                  <SidebarMenuItem key={chat.chat_id}>
                    <SidebarMenuButton
                      className={`${
                        currentChatListIndex === index ? "bg-slate-400" : ""
                      }`}
                      onClick={() => {
                        titleOnClickHandler(chat.chat_id);
                        if (isMobile) toggleSidebar();
                      }}
                    >
                      {chat.title.length > 12
                        ? chat.title.slice(0, 12) + "..."
                        : chat.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Card
          className={`${
            !open && "w-[30px] "
          } h-[30px] hover:bg-gray-800 hover:text-white`}
        >
          <CardContent className="w-full h-full flex justify-between items-center p-0">
            <button
              className="w-full flex justify-evenly items-center "
              onClick={() =>
                signOut({
                  callbackUrl: window.location.origin,
                  redirect: true,
                })
              }
            >
              {open ? (
                <span className="inline-block">Sign out</span>
              ) : (
                <LogOut size={16} />
              )}
            </button>
          </CardContent>
        </Card>
      </SidebarFooter>
    </Sidebar>
  );
}
