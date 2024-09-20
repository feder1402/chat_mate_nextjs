import { Message } from "./ChatTypes"
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import '@/styles/markdown.css'

type ChatMessageProps = { message: Message }

export default function ChatMessages({ message }: ChatMessageProps) {
    return (
        <div className={`prose prose-p:mt-1 mb-2 p-2 rounded-lg ${message.role === 'user' ? 'bg-purple-100 ml-auto' : 'bg-gray-100'} max-w-[60%]`} >
            <b>{message.role === 'user' ? 'You' : '🧉 ChatMate'}:</b>
            <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
        </div>
    )
}