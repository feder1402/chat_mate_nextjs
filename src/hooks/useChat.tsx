import { ChatMessageType } from "@/types/ChatTypes"
import { useState } from "react"

const useChat = () => {
    const [messages, setMessages] = useState<ChatMessageType[]>([])
    const [error, setError] = useState('')
    const [isThinking, setIsThinking] = useState(false)
    const [runId, setRunId] = useState<string | null | undefined>(undefined)

    const onSubmit = async (query: string) => {
        if (!query || query.trim() === '') {
            return
        }
        const userMessage: ChatMessageType = { role: 'user', content: query }
        const systemResponse : ChatMessageType = { role: 'bot', content: '' }
        const newMessages = [...messages, userMessage, systemResponse]
        setError('')
        setMessages(newMessages)
        setIsThinking(true)
        try {
            const response = await callChatApi(userMessage)
            const runId = response.headers.get('x-langsmith-run-id');
            console.log('Run ID:', runId)
            setRunId(runId)  
            const chunk = await responseIterator(response)
            let content = ''
            for await (const value of chunk) {
                try {
                    content += value;
                    newMessages[newMessages.length - 1].content = content
                    setMessages([...newMessages])
                        }
                catch (e) {
                    if (e instanceof Error) {
                        setError(e.message)
                    } else {
                        setError('Unknown error occurred while processing the response')
                    }
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('Unknown error occurred while preparing to send ')
            }
        } finally {
            setIsThinking(false)
        }
    }

    return {messages, onSubmit, error, isThinking, runId}
}

const callChatApi = (userMessage: ChatMessageType) => {
    return fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: [userMessage] })
    })
}

async function* responseIterator(response: Response): AsyncGenerator<string> {
    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error('Response body is null');
    }
    const decoder = new TextDecoder('utf-8');

    for (; ;) {
        const { done, value } = await reader.read()
        if (done) break;

        try {
            yield decoder.decode(value)
        }
        catch (e) {
            if (e instanceof Error) {
                console.warn(e.message)
            } else {
                console.warn('An unknown error occurred using streaming fetch')
            }
        }

    }
}

export default useChat