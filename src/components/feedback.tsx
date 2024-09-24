"use client"

import { useState } from "react"
import { ThumbsDown, ThumbsUp, X } from 'lucide-react';

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function Feedback() {
  const [showFeedbackOptions, setShowFeedbackOptions] = useState(false)
  const [otherReason, setOtherReason] = useState("")
  const [showOtherReasonInput, setShowOtherReasonInput] = useState(false)
  const handleThumbsDown = () => {
    setShowFeedbackOptions(true)
  }
  const handleClosePopup = () => {
    setShowFeedbackOptions(false)
    setShowOtherReasonInput(false)
  }
  const handleOtherReasonChange = (e) => {
    setOtherReason(e.target.value)
  }
  const handleOtherReasonSelect = () => {
    setShowOtherReasonInput(true)
  }

  const reasonsForThumbsDown = [
    "Not correct",
    "Incomplete",
    "Does not answer the question",
  ]
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" className="text-green-500 hover:bg-green-100">
        <ThumbsUp color="green" className="w-6 h-6" />
        <span className="sr-only">Thumbs up</span>
      </Button>
      <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100" onClick={handleThumbsDown}>
        <ThumbsDown color="red" className="w-6 h-6" />
        <span className="sr-only">Thumbs down</span>
      </Button>
      {showFeedbackOptions && (
        <div className="bg-white shadow-lg rounded-md p-4 w-full relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-500 hover:bg-gray-100"
            onClick={handleClosePopup}
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Close</span>
          </Button>
          <p className="text-gray-700 text-center font-medium mb-2">Tell us more...</p>
          <div className="flex gap-3">
            {reasonsForThumbsDown
              .map((reason, index) => {
                return (
                  <Button key={index} variant="ringHover" size="sm" className="text-left">
                    {reason}
                  </Button>
                )
              }
              )
            }
            {/* <Checkbox id="other-reason" onCheckedChange={handleOtherReasonSelect} />
            <Label htmlFor="other-reason">Other reason</Label>
            {showOtherReasonInput && (
              <Input
                id="other-reason-text"
                type="text"
                placeholder="Enter your reason"
                value={otherReason}
                onChange={handleOtherReasonChange}
              />
            )} */}
          </div>
        </div>
      )
      }
    </div >
  )
}
