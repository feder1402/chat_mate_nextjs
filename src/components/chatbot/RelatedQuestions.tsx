import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function RelatedQuestions(props: { relatedQuestions: string[], onSubmit?: (query: string) => void }) {
    return props.relatedQuestions.length > 0 
    ? (
        <div className='flex items-center m-2'>
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger>
                        <div className='flex items-center'><Lightbulb size={14} strokeWidth={3} color='purple' />:</div> 
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-black text-white">
                        <p>Related questions</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {props.relatedQuestions.map((question, index) => (
                <Button key={index} variant="purpleGhost" onClick={() => props.onSubmit?.(question)} >{question}</Button>
            ))}
        </div>
    )
    : ( <div className='mt-4'>{' '}</div> )
}
