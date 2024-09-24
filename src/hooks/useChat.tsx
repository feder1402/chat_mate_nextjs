import { ChatMessage } from "@/types/ChatTypes"
import { useState } from "react"

const useChat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [error, setError] = useState('')
    const [isThinking, setIsThinking] = useState(false)

    const onSubmit = async (query: string) => {
        if (!query || query.trim() === '') {
            return
        }
        const userMessage: ChatMessage = { role: 'user', content: query }
        const systemResponse : ChatMessage = { role: 'bot', content: '' }
        const newMessages = [...messages, userMessage, systemResponse]
        setMessages(newMessages)
        setIsThinking(true)
        try {
            const chunk = await streamingFetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: [userMessage] })
            })
            let response = ''
            for await (const value of chunk) {
                try {
                    response += value;
                    newMessages[newMessages.length - 1].content = response
                    setMessages([...newMessages])
                        }
                catch (e) {
                    if (e instanceof Error) {
                        console.warn(e.message)
                    } else {
                        console.warn('An unknown error occurred')
                    }
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
                console.error('An error occurred:', error.message)
            }
        } finally {
            setIsThinking(false)
        }
    }

    return { messages, onSubmit, error, isThinking }
}

export async function* streamingFetch(input: RequestInfo | URL, init?: RequestInit) {
    const response = await fetch(input, init)
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