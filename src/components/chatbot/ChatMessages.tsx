import { useEffect, useRef } from 'react';
import { Loader } from 'lucide-react';
import { ChatStateType } from '@/types/ChatTypes'
import ChatMessage from './ChatMessage'
import BotResponseFeedback from './BotResponseFedback'
import { ThumbsFeedbackType } from '@/types/ThumbsFeedbackType';
import CopyToClipboard from '../CopyToClipboard';

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
            className="flex-grow mb-4 p-2 border bg-slate-50 rounded-md shadow-md overscroll-none overflow-auto"
        >
            {messages && messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
            ))}
            {error && (
                <div className="text-red-500 mb-2" role="alert">Error: {error}</div>
            )}
            {isLoading && (
                <span className="flex items-center text-slate-600 mb-2 text-sm font-light">
                    <Loader size={14}/> Thinking...
                </span>
            )}
            {messages && messages.length > 0 && !error && !isLoading && (
                <div>
                <div className='flex items-center' >
                    <CopyToClipboard text={messages[messages.length - 1].content} />
                    <BotResponseFeedback onSubmit={onFeedback} />
                </div>
                    {/* {getRelatedQuestions(messages[messages.length - 1].content)
                    .map((question, index) => (
                        <div key={index} className="text-sm text-slate-400">{question}</div>
                    ))} */}
                </div>
            )}
        </div>
    )
}

const extractRelatedQuestions = (content: string) => {
    const matches = content.match(/<related_questions>([\s\S]*?)<\/related_questions>/);
    if (!matches) {
        return [];
    }
    const message = content?.substring(0, matches.index);
    //const questions = matches[1].split('\n').map((q) => q.trim()).filter((q) => q.length > 0);
//    const questions = matches[1].match(/<question>([\s\S]*?)<\/question>/);
    const related = matches?.[1]?.match(/<question>([\s\S]*?)<\/question>/g)?.map(item => item?.match(/<question>([\s\S]*?)<\/question>/)?.[1]) || [];
    return [message, related];
}