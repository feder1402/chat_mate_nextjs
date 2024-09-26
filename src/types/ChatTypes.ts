export type ChatMessageType = {
  role: "user" | "bot" | "system";
  content: string;
};

export type ChatStateType = {
  messages: ChatMessageType[];
  error?: string;
  isLoading?: boolean;
};
