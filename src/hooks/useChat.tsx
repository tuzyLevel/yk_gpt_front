"use client";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuid4 } from "uuid";
import useSocket from "./useSocket";

type UseChatProps = {
  email: string;
};

const UseChat = ({ email }: UseChatProps) => {
  const [currentChatListIndex, setCurrentChatListIndex] = useState<number>(-1);
  const [chatList, setChatList] = useState<Chat[]>([]);

  // Use useCallback to memoize the handler and prevent unnecessary re-renders
  const receivedChatHandler = useCallback(
    (key: string, chatId: string, message: string, writer: string) => {
      setChatList((prevChatList) => {
        const targetChat = prevChatList.find((chat) => chat.key === key);
        if (!targetChat) {
          return prevChatList;
        }

        const newChatLine: ChatLine = {
          writer,
          message,
        };

        const newChatLines = [
          ...targetChat.chatLines.slice(0, -1),
          newChatLine,
        ];

        const newChat = {
          ...targetChat,
          chat_id: chatId,
          chatLines: newChatLines,
        };

        return prevChatList.map((chat) => (chat.key === key ? newChat : chat));
      });
    },
    [] // The dependency array is empty because it only uses the functional update form
  );

  const receivedNewTitleHandler = useCallback(
    (key: string, newTitle: string) => {
      setChatList((prev) =>
        prev.map((chat) =>
          chat.key === key ? { ...chat, title: newTitle } : chat
        )
      );
    },
    []
  );

  const [socket] = useSocket({
    receivedChatHandler,
    receivedNewTitleHandler,
  });

  const sendChatHandler = async (message: string) => {
    const key =
      currentChatListIndex !== -1
        ? chatList[currentChatListIndex].key
        : uuid4();
    const chat_id =
      currentChatListIndex !== -1 ? chatList[currentChatListIndex].chat_id : "";
    const writer = email;
    const title =
      currentChatListIndex !== -1
        ? chatList[currentChatListIndex].title
        : "new chat";

    const newChatLine: ChatLine = {
      writer,
      message,
    };
    const answerChatLine: ChatLine = {
      writer: "AI",
      message: "",
    };
    const newCurrentChat = {
      key,
      title,
      chat_id,
      chatLines:
        currentChatListIndex !== -1
          ? [
              ...chatList[currentChatListIndex].chatLines,
              newChatLine,
              answerChatLine,
            ]
          : [newChatLine, answerChatLine],
    };

    setChatList((prev) => {
      const updatedChatList =
        currentChatListIndex === -1
          ? [...prev, newCurrentChat]
          : prev.map((chat) =>
              chat.chat_id === chat_id ? newCurrentChat : chat
            );
      if (currentChatListIndex === -1)
        setCurrentChatListIndex(() => updatedChatList.length - 1);
      return updatedChatList;
    });

    socket?.emit("chat", {
      key,
      chat_id,
      writer: email,
      message,
    });
  };

  const resetCurrentChatListIndexHandler = () => {
    setCurrentChatListIndex(-1);
  };

  const setCurrentChatListIndexHandler = (chatId: string) => {
    setCurrentChatListIndex(() =>
      chatList.findLastIndex((chat) => chat.chat_id === chatId)
    );
  };

  const titleOnClickHandler = async (chatId: string) => {
    const res = await fetch(`/api/chat/${chatId}`);
    const data = await res.json();
    const initialChatLines: ChatLine[] = data.map(
      (item: { user_id: string; message: string }) => ({
        writer: item.user_id,
        message: item.message,
      })
    );
    setCurrentChatListIndexHandler(chatId);
    setChatList((prev) =>
      prev.map((chat) =>
        chat.chat_id === chatId
          ? { ...chat, chatLines: initialChatLines }
          : chat
      )
    );
  };

  useEffect(() => {
    if (!email) return;
    const fetchChatTitles = async () => {
      try {
        const response = await fetch(`/api/chat/titles/${email}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const titles: ChatTitle[] = data["titles"];
        const initialChatList: Chat[] = titles.map((chatTitleItem) => ({
          key: uuid4(),
          title: chatTitleItem.title,
          chat_id: chatTitleItem.chat_id,
          chatLines: [],
        }));
        setChatList(initialChatList);
      } catch (error) {
        console.error("Failed to fetch chat titles:", error);
      }
    };

    fetchChatTitles();
  }, [email]);

  // useEffect(() => {
  //   if (currentChatListIndex === -1) {
  //     return;
  //   }
  //   const currentChatId = chatList[currentChatListIndex].chat_id;

  // const fetchCurrentChatListHandler = async () => {
  //   const res = await fetch(`/api/chat/${currentChatId}`);
  //   const data = await res.json();
  //   const initialChatLines: ChatLine[] = data.map((item: any) => ({
  //     writer: item.user_id,
  //     message: item.message,
  //   }));
  //   setChatList((prev) =>
  //     prev.map((chat) =>
  //       chat.chat_id === currentChatId
  //         ? { ...chat, chatLines: initialChatLines }
  //         : chat
  //     )
  //   );
  // };

  //   fetchCurrentChatListHandler();
  // }, [currentChatListIndex]);

  return {
    currentChat:
      currentChatListIndex >= 0 ? chatList[currentChatListIndex] : null,
    currentChatListIndex,
    chatList,
    sendChatHandler,
    setCurrentChatListIndexHandler,
    resetCurrentChatListIndexHandler,
    titleOnClickHandler,
  };
};

export default UseChat;
