"use client"

import { useState } from "react";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { ThumbsFeedbackType, ThumbState } from "@/types/ThumbsFeedbackType";
import ThumbStateView from "./ThumbStateView";
import Reason from "./Reason";
import { PopoverAnchor } from "@radix-ui/react-popover";

const initialState: ThumbsFeedbackType = {
    thumbState: 'none',
    reason: ''
}

export default function ThumbsFeedback({ reasons, onSubmit: onFeedbackSubmitted }: { reasons: string[], onSubmit: (feedback: ThumbsFeedbackType) => void }) {
    const [feedback, setFeedback] = useState<ThumbsFeedbackType>(initialState);
    const [isReasonOpen, setIsReasonOpen] = useState(false);
    const { thumbState } = feedback

    const onThumbsChanged = (thumbState: ThumbState) => {
        const newFeedback = { ...feedback, thumbState };
        setFeedback(newFeedback);

        // Submit feedback if thumbs up
        if (thumbState === 'thumbsUp') {
            onFeedbackSubmitted({ ...newFeedback, reason: '' });
        }
        
        // Ask for an optional reason if thumbs down
        if (thumbState === 'thumbsDown') {
            setIsReasonOpen(true);
        }
    }

    const onReasonSubmit = (reason: string) => {
        const newFeedback = { ...feedback, reason };
        setFeedback(newFeedback);
        onFeedbackSubmitted(newFeedback);
        setIsReasonOpen(false);
    }

    const onPopupOpenChange = (state: boolean) => {
        setIsReasonOpen(state)

        // User closed popup, return feedback as is
        if (state === false) {
            onFeedbackSubmitted(feedback);
        }
    }

    return (
        <Popover open={isReasonOpen} onOpenChange={onPopupOpenChange}>
            <PopoverAnchor className="w-min">
                <ThumbStateView onChange={onThumbsChanged} value={thumbState} />
            </PopoverAnchor>
            <PopoverContent
                className="rounded p-5 ml-5 bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
                sideOffset={5}
            >
                <Reason reasons={reasons} onSubmit={onReasonSubmit} />
            </PopoverContent>
        </Popover>
    )
}