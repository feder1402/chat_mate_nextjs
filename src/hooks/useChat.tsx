import { useState } from "react"
import { v4 as uuidv4 } from "uuid";
import { useSessionStorage } from 'usehooks-ts'
import { ChatMessageType } from "@/types/ChatTypes"

const EXTRA_CONTENT_TAG = '<extra_content>'
const SESSION_ID = uuidv4()

const useChat = (storagekey: string, initialMessages: ChatMessageType[] = []) => {
    const [messages, setMessages] = useSessionStorage<ChatMessageType[]>(storagekey, initialMessages, { initializeWithValue: false })
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
        const newMessages = [...messages, userMessage, assistantResponse].splice(-10)
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
        body: JSON.stringify({ messages, metadata: {session_id: SESSION_ID }})
    })
}

export default useChat