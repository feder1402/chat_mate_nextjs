'use client'

import UserQuestion from './UserQuestion'
import ChatMessages from './ChatMessages';
import initialMessages from './InitialMessages';

import useChat from '@/hooks/useChat';
import { ThumbsFeedbackType } from '@/types/ThumbsFeedbackType';
import { sendFeedback } from '@/components/thumbs_feedback/SendFeedback';
import RelatedQuestions from './RelatedQuestions';

const DEFAULT_RELATED_QUESTIONS = [
  "I'm a new associate. What should I do to be successful?",
  "I have a meeting with a potential client. What should I do?",
  "How can I help potential members understand the value of LegalShield services?"
]

export default function ChatBot() {

  const { messages, onSubmit, error, isThinking, runId, extraContent } = useChat(initialMessages)

  const onFeedback = async (thumbFeedback: ThumbsFeedbackType) => {
    if (!runId) {
      console.warn('No runId found for feedback')
      return
    }
    const { thumbState, reason } = thumbFeedback
    await sendFeedback(runId, 'userfeedback', { value: thumbState, comment: reason })
  }

  let relatedQuestions: string[] = [];
  if (!isThinking && extraContent) {
    relatedQuestions = extractRelatedQuestions(extraContent);
  }

  if (relatedQuestions.length == 0) {
    relatedQuestions = DEFAULT_RELATED_QUESTIONS;
  }

  return (
    <div className="container flex gap-2 flex-col h-full overscroll-none overflow-auto max-h-full mx-auto p-4">
      <ChatMessages messages={messages} error={error} isLoading={isThinking} onFeedback={onFeedback} />
      <UserQuestion onSubmit={onSubmit} isLoading={isThinking} />
      <RelatedQuestions relatedQuestions={relatedQuestions} onSubmit={onSubmit} />
    </div>
  )
}

const extractRelatedQuestions = (content: string): string[] => {
  const matches = content.match(/<related_questions>([\s\S]*?)<\/related_questions>/);
  if (!matches) {
    return [];
  }
  const related = matches?.[1]
    ?.match(/<question>([\s\S]*?)<\/question>/g)
    ?.map(item => item?.match(/<question>([\s\S]*?)<\/question>/)?.[1]).filter(item => item != undefined) ?? [];
  return related;
}