"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Sidebar from "@/components/layout/Sidebar";
import MainContent from "@/components/layout/MainContent";
import useChat from "@/hooks/useChat";
import SessionWrapper from "@/components/SessionProvider";

export default function Wrapper() {
  return (
    <SessionWrapper>
      <Home />
    </SessionWrapper>
  );
}

function Home() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const email = user?.email ?? "";
  const {
    currentChat,
    chatList,
    currentChatListIndex,
    sendChatHandler,
    setCurrentChatListIndexHandler,
    resetCurrentChatListIndexHandler,
    titleOnClickHandler,
  } = useChat({ email });

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated")
    return (
      <main className="w-full flex min-h-dvh h-dvh overflow-hidden">
        <Sidebar
          chatList={chatList}
          currentChatListIndex={currentChatListIndex}
          setCurrentChatListIndexHandler={setCurrentChatListIndexHandler}
          resetCurrentChatListIndexHandler={resetCurrentChatListIndexHandler}
          titleOnClickHandler={titleOnClickHandler}
        />
        <MainContent
          currentChat={currentChat}
          sendChatHandler={sendChatHandler}
        />
      </main>
    );

  return (
    <div>
      <p>You are not signed in.</p>
      <button onClick={() => signIn("google", { prompt: "select_account" })}>
        Sign in
      </button>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
