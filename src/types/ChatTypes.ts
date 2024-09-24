export type ChatMessage = {
  role: "user" | "bot" | "system";
  content: string;
};

export type ChatState = {
  messages: ChatMessage[];
  error?: string;
  isLoading?: boolean;
};
