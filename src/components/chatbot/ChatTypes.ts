export type Message = {
  role: "user" | "bot";
  content: string;
};

export type ChatState = {
  messages: Message[];
  error?: string;
  isLoading?: boolean;
};
