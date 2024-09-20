import { Message } from "./ChatTypes"
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import '@/styles/markdown.css'

type ChatMessageProps = { message: Message }

export default function ChatMessages({ message }: ChatMessageProps) {
    return (
        <>
            {message.role === 'user'
                ? (
                    <>
                        <div className="mb-2 p-2 rounded-lg bg-purple-100 float-right max-w-[80%]" >
                            <b>{"You: "}</b> {message.content}
                        </div>
                        <div className="clear-right" />
                    </>
                )
                : (
                    <div className="prose mb-2 p-2 rounded-lg bg-gray-100 max-w-[80%]" >
                        <b>{'🧉 ChatMate'}:</b>
                        <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
                    </div>
                )
            }
        </>
    )
}