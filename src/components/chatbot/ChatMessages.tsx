import { useEffect, useRef } from 'react';
import { Loader } from 'lucide-react';
import { ChatStateType } from '@/types/ChatTypes'
import ChatMessage from './ChatMessage'
import BotResponseFeedback from './BotResponseFedback'
import { ThumbsFeedbackType } from '@/types/ThumbsFeedbackType';
import CopyToClipboard from '@/components/CopyToClipboard';

type ChatMessagesProps = Partial<ChatStateType> & {
    onFeedback: (value: ThumbsFeedbackType) => void;
}

export default function ChatMessages({ messages, error, isLoading, onFeedback }: ChatMessagesProps) {

    const ref = useRef<HTMLDivElement>(null);

    // Scroll to the bottom of the chat messages
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [messages, error, isLoading]);

    return (
        <div
            ref={ref}
            className="flex-grow p-2 border  bg-purple-50 rounded-md shadow-md overscroll-none overflow-auto"
        >
            {messages && messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
            ))}
            {error && (
                <div className="text-red-500 mb-2" role="alert">Error: {error}</div>
            )}
            {isLoading && (
                <span className="flex items-center text-slate-600 mb-2 text-sm font-light">
                    <Loader size={14} /> Thinking...
                </span>
            )}
            {messages && messages.length > 0 && !error && !isLoading && messages[messages.length - 1].role === 'bot' && (
                <div className='flex items-center' >
                    <CopyToClipboard text={messages[messages.length - 1].content} />
                    {messages.length > 1 && <BotResponseFeedback onSubmit={onFeedback} />}
                </div>
            )}
        </div>
    )
}