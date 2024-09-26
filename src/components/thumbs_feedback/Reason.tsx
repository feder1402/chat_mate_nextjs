"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ReasonDetails from "./ReasonDetail";

const OTHER_REASON = 'Something else...';

const Reason = ({ onSubmit, reasons = [] }: { onSubmit: (comment: string) => void, reasons?: string[] }) => {
    const [isOtherReason, setIsOtherReason] = useState(false);

    const onReasonChosen = (reason: string) => {
        // Ask for details if "Something else..." is chosen
        if (reason === 'Something else...') {
            setIsOtherReason(true);
        } else {
            onSubmit(reason);
        }
    }

    return (
        <>
            {!isOtherReason
                ? (
                    // Display reasons to choose from
                    <div>
                        <p className="p-1 font-extralight">Tell us why...</p>
                        {[...reasons, OTHER_REASON].map((reason, index) => (
                            <Button key={index} size="sm" className="font-light" variant={"ghost"} onClick={() => onReasonChosen(reason)}>{reason}</Button>
                        ))}
                    </div>
                )
                : (
                    // Ask for details if other reason was chosen 
                    <ReasonDetails onSubmit={onSubmit} />
                )
            }
        </>
    )
}

export default Reason;