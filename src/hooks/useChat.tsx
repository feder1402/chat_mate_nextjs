import { ChatMessageType } from "@/types/ChatTypes"
import { useState } from "react"

const EXTRA_CONTENT_TAG = '<extra_content>'

const useChat = () => {
    const [messages, setMessages] = useState<ChatMessageType[]>([])
    const [error, setError] = useState('')
    const [isThinking, setIsThinking] = useState(false)
    const [runId, setRunId] = useState<string | null | undefined>(undefined)
    const [extraContent, setExtraContent] = useState<string>('');

    const onSubmit = async (query: string) => {
        if (!query || query.trim() === '') {
            return
        }
        const userMessage: ChatMessageType = { role: 'user', content: query }
        const assistantResponse: ChatMessageType = { role: 'bot', content: '' }
        const newMessages = [...messages, userMessage, assistantResponse]
        setError('')
        setMessages(newMessages)
        setIsThinking(true)
        try {
            // Call chat API
            const response = await callChatApi(newMessages.slice(0, -1)) // Do not send the response message    
            
            if (!response.ok) {
                throw new Error(`Failed to process the request: ${response.statusText}`)
            }

            // Get runId from response headers (used to associate user feedback with the correct run)
            const runId = response.headers.get('x-langsmith-run-id');
            setRunId(runId)

            // Read response body as a stream
            let content = ''
            const reader = response.body?.getReader();

            if (!reader) {
                throw new Error('Failed to read response body')
            }

            const decoder = new TextDecoder('utf-8');
            let done = false;
            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    content += chunk;

                    // Add partial response to the last message
                    const content_ndx = content.indexOf(EXTRA_CONTENT_TAG);
                    if (content_ndx > -1) {
                        newMessages[newMessages.length - 1].content = content.substring(0, content_ndx)
                        setExtraContent(content.substring(content_ndx))
                    } else {
                        newMessages[newMessages.length - 1].content = content
                        setExtraContent('')
                    }
                    
                    setMessages([...newMessages]);
                }
            }
        } catch (e) {
            console.error(e)
            if (e instanceof Error) {
                setError(e.message)
            } else {
                setError('Unknown error occurred while processing the response')
            }
        }
        finally {
            setIsThinking(false)
        }
    }

    return { messages, onSubmit, error, isThinking, runId, extraContent }
}

const callChatApi = (messages: ChatMessageType[]) => {
    return fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages })
    })
}

export default useChat