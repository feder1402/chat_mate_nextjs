import { Message } from "./ChatTypes"
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import '@/styles/markdown.css'

type ChatMessageProps = { message: Message }

export default function ChatMessages({ message }: ChatMessageProps) {
    return (
        <div className={`mb-2 p-2 rounded-lg ${message.role === 'user' ? 'bg-purple-100 ml-auto' : 'bg-gray-100'} max-w-[60%]`} >
            <p><b>{message.role === 'user' ? 'You' : '🧉 ChatMate'}:</b></p>
            <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
        </div>
    )
}