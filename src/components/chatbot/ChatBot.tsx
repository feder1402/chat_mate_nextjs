'use client'

import UserQuestion from './UserQuestion'
import ChatMessages from './ChatMessages';

import useChat from '@/hooks/useChat';
import { ThumbsFeedbackType } from '@/types/ThumbsFeedbackType';
import { sendFeedback } from '@/components/thumbs_feedback/SendFeedback';

export default function ChatBot() {

  const { messages, onSubmit, error, isThinking, runId } = useChat()

  const onFeedback = async (thumbFeedback: ThumbsFeedbackType) => {
    if (!runId) {
      console.warn('No runId found for feedback')
      return
    }
    const { thumbState, reason } = thumbFeedback
    await sendFeedback(runId, 'userfeedback', { value: thumbState, comment: reason })
  }

  return (
    <div className="container flex flex-col h-full overscroll-none overflow-auto max-h-full mx-auto p-4">
      <ChatMessages messages={messages} error={error} isLoading={isThinking} onFeedback={onFeedback}/>
      <UserQuestion onSubmit={onSubmit} isLoading={isThinking} />
    </div>
  )
}
