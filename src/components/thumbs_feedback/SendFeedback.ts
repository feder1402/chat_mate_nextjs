"use client"

type FeedbackType = {
    score?: string;
    value?: string;
    comment?: string;
}

export const sendFeedback = async (runId: string, tag: string, feedback: FeedbackType): Promise<void> => {
    if (!runId) {
      console.warn('No runId found for feedback')
      return
    }
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ runId, tag, feedback })
    })
    if (response.ok) {
      console.log('Feedback sent successfully')
      const feedbackResponse = await response.json()
      console.log('Feedback response:', feedbackResponse)
    } else {
      console.error('Error sending feedback')
    }
};