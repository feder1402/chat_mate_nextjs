'use client'

import UserQuestion from './UserQuestion'
import ChatMessages from './ChatMessages';

import useChat from '@/hooks/useChat';

export default function ChatBot() {

  const {messages, onSubmit, error, isThinking} = useChat()

  return (
    <div className="container flex flex-col h-full overscroll-none overflow-auto max-h-full mx-auto p-4">
      <ChatMessages messages={messages} error={error} isLoading={isThinking} />
      <UserQuestion onSubmit={onSubmit} isLoading={isThinking} />
    </div>
  )
}