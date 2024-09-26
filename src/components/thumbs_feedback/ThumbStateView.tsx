"use client"

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { ThumbState } from "../../types/ThumbsFeedbackType";

export default function ThumbStateView({ onChange, value }: { onChange?: (value: ThumbState) => void, value: ThumbState }) {
  return (
    <>
      <div className="flex items-center gap-2 w-min">
        {value != 'thumbsDown' && <ThumbsUpButton value={value} onClick={() => onChange?.('thumbsUp')} />}
        {value != 'thumbsUp' && <ThumbsDownButton value={value} onClick={() => onChange?.('thumbsDown')} />}
      </div >
    </>
  )
}

const ThumbsUpButton = ({ value, onClick }: { value: ThumbState, onClick: () => void }) => (
  <Button variant="ghost" size="icon" disabled={value === 'thumbsUp'} className={`text-green-500 hover:bg-green-100`} onClick={onClick}>
    <ThumbsUp color="green" fill={value === 'thumbsUp' ? "lightgreen" : "white"} className="w-6 h-6" />
    <span className="sr-only">Thumbs up</span>
  </Button>
)

const ThumbsDownButton = ({ value, onClick }: { value: ThumbState, onClick: () => void }) => (
  <Button variant="ghost" size="icon" disabled={value === 'thumbsDown'} className={`text-red-500 hover:bg-red-100`} onClick={onClick}>
    <ThumbsDown color="red" fill={value === 'thumbsDown' ? "lightcoral" : "white"} className="w-6 h-6" />
    <span className="sr-only">Thumbs down</span>
  </Button>
)


