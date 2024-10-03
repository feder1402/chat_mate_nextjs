"use client"

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ThumbState } from "../../types/ThumbsFeedbackType";
import { TooltipArrow } from '@radix-ui/react-tooltip';

export default function ThumbStateView({ onChange, value }: { onChange?: (value: ThumbState) => void, value: ThumbState }) {
  return (
    <div className="flex items-center w-min">
      {value != 'thumbsDown' && <ThumbsUpButton value={value} onClick={() => onChange?.('thumbsUp')} />}
      {value != 'thumbsUp' && <ThumbsDownButton value={value} onClick={() => onChange?.('thumbsDown')} />}
    </div >
  )
}

const ThumbsUpButton = ({ value, onClick }: { value: ThumbState, onClick: () => void }) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" disabled={value === 'thumbsUp'} className={`text-green-500 hover:bg-green-100`} onClick={onClick}>
          <ThumbsUp color="green" size={16} fill={value === 'thumbsUp' ? "lightgreen" : "white"} />
          <span className="sr-only">Thumbs up</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-black text-white">
        <TooltipArrow />
        <p>Good response</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

const ThumbsDownButton = ({ value, onClick }: { value: ThumbState, onClick: () => void }) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" disabled={value === 'thumbsDown'} className={`text-red-500 hover:bg-red-100`} onClick={onClick}>
          <ThumbsDown color="red" size={16} fill={value === 'thumbsDown' ? "lightcoral" : "white"} />
          <span className="sr-only">Thumbs down</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-black text-white">
        <TooltipArrow />
        <p>Bad response</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)



