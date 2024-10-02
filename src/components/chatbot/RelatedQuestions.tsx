import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function RelatedQuestions(props: { relatedQuestions: string[], onSubmit?: (query: string) => void }) {
    return props.relatedQuestions.length > 0 &&
        (
            <div className='flex items-center'>
                <LightbulbWithTooltip />
                {props.relatedQuestions.map((question, index) => (
                    <Button key={index} variant="blackGhost" onClick={() => props.onSubmit?.(question)} >{question}</Button>
                ))}
            </div>
        )
}

const LightbulbWithTooltip = () => {
    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger>
                    <Lightbulb size={14} strokeWidth={3} color='black' fill="yellow" />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-black text-white">Related questions</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
