import { ChatState } from './ChatTypes'
import ChatMessage from './ChatMessage'
import { useEffect, useRef } from 'react';

type ChatMessagesProps = Partial<ChatState>

export default function ChatMessages({ messages, error, isLoading }: ChatMessagesProps) {

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }, [messages, error, isLoading]);

    return (
        <div
            ref={ref}
            className="flex-grow mb-4 p-4 border bg-slate-50 rounded-md shadow-md overscroll-none overflow-auto"
        >
            {messages && messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
            ))}
            {error && (
                <div className="text-red-500 mb-2" role="alert">Error: {error}</div>
            )}
            {isLoading && (
                <div className="text-blue-500 mb-2" role="alert">Thinking...</div>
            )}
        </div>
    )
}