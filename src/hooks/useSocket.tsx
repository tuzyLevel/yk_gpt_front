import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

type UseSocketProps = {
  url?: string;
  receivedChatHandler: (
    key: string,
    chatId: string,
    message: string,
    writer: string
  ) => void;
  receivedNewTitleHandler: (key: string, newTitle: string) => void;
};

const useSocket = ({
  receivedChatHandler,
  receivedNewTitleHandler,
}: UseSocketProps) => {
  // 선택적 기본 URL
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false); // 연결 상태 추적

  useEffect(() => {
    const socket = io(window.location.origin, {
      transports: ["websocket", "polling"],
      upgrade: true,
      rememberUpgrade: true,
      secure: true,
      rejectUnauthorized: false,
    }); // 소켓 인스턴스 생성

    setSocketInstance(socket);
    setIsConnected(socket.connected); // 초기 연결 상태 설정

    socket.on("connect", () => {
      console.log("서버에 연결되었습니다!");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("서버와 연결이 끊어졌습니다.");
      setIsConnected(false);
    });

    socket.on("chat", (data) => {
      const {
        key,
        chat_id: chatId,
        answer_chat_line: { message, writer },
      } = data;

      receivedChatHandler(key, chatId, message, writer);
    });

    socket.on("new_title", (data) => {
      const { key, title } = data;

      receivedNewTitleHandler(key, title);
    });

    socket.on("response", (data) => {
      console.log(`received data from server: ${data}`);
    });

    socket.on("connect_error", (error) => {
      console.error("연결 오류:", error);
    });

    return () => {
      // 정리 함수
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
      socket.off("connect_error");
      socket.disconnect(); // 명확한 연결 해제
    };
  }, [receivedChatHandler, receivedNewTitleHandler]); // URL이 변경될 때만 소켓 재생성

  return [socketInstance, isConnected] as const; // 소켓 인스턴스와 연결 상태 반환
};

export default useSocket;
