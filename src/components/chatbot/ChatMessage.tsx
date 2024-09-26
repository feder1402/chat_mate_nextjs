import { ChatMessageType } from '@/types/ChatTypes'
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import '@/styles/markdown.css'

type ChatMessageProps = { message: ChatMessageType }

export default function ChatMessage({ message }: ChatMessageProps) {
    return (
        <>
            {message.role === 'user'
                ? (
                    <>
                        <div className="mb-2 mt-4 p-2 rounded-lg bg-purple-100 float-right max-w-[80%]" >
                            <b>{"You: "}</b> {message.content}
                        </div>
                        <div className="clear-right" />
                    </>
                )
                : (
                    <div className="prose p-2 rounded-lg bg-gray-100 max-w-[80%]" >
                        <b>{'🧉 ChatMate'}:</b>
                        <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
                    </div>
                )
            }
        </>
    )
}