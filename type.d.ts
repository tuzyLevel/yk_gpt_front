type Title = {
  id: string;
  title: string;
};

type Titles = title[];

type ChatLine = {
  writer: string;
  message: string;
};

type Chat = {
  key: string;
  title: string;
  chat_id: string;
  chatLines: ChatLine[];
};

type ChatTitle = {
  chat_id: string;
  title: string;
};
