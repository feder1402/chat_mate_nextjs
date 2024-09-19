'use client'

import React, { useState } from 'react'
import UserQuestion from './UserQuestion'
import ChatMessages from './ChatMessages';
import { ChatState } from './ChatTypes';
import { chatAction } from '@/actions/chat';

const initialState = { messages: [] }

export default function ChatBot() {
  const [state, setState] = useState<ChatState>(initialState)

  const onQuestionSubmitted = async (payload: FormData) => {
    const message = payload.get('message') as string;
    if (!message || message.trim() === '') {
      return
    }
    const questionState = { messages: [...state.messages, { role: 'user', content: message }], isLoading: true } as ChatState
    setState(questionState)
    const answerState = await chatAction(questionState, message)
    setState({...answerState, isLoading: false})
  }

  const { messages, error, isLoading } = state

  return (
    <div className="container flex flex-col h-screen mx-auto p-4">
      <ChatMessages messages={messages} error={error} isLoading={isLoading} />
      <UserQuestion onSubmit={onQuestionSubmitted} isLoading={state.isLoading} />
    </div>
  )
}