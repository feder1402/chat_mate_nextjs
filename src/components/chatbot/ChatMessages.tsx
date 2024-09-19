import ReactMarkdown from 'react-markdown'
import { ChatState } from './ChatTypes'
import useScrollToBottom from '@/hooks/useScrollToBottom'
import ChatMessage from './ChatMessage'

type ChatMessagesProps = Partial<ChatState>

export default function ChatMessages({ messages, error, isLoading }: ChatMessagesProps) {

    const scrollAreaRef = useScrollToBottom()

    return (
        <div
            ref={scrollAreaRef}
            className="flex-grow mb-4 p-4 border  bg-slate-50 rounded-md shadow-md h-full max-h-screen overflow-y-hidden scroll-smooth"
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