"use client"

import ThumbsFeedback from "@/components/thumbs_feedback";
import { ThumbsFeedbackType } from "@/types/ThumbsFeedbackType";

const reasonsForThumbsDown = [
    "Did not answer the question",
    "Response is incorrect",
    "Response is incomplete",
    "Response is not clear",
]

export default function Sandbox() {
    const onSubmit = (feedback: ThumbsFeedbackType) => {
        console.log('Feedback:', feedback)
    }

    return (
        <div className="container mx-auto p-4">
            <ThumbsFeedback reasons={reasonsForThumbsDown} onSubmit={onSubmit} />
        </div>
    )
}