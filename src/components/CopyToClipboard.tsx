import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip"
import { TooltipArrow } from '@radix-ui/react-tooltip';

export default function CopyToClipboard({ text }: { text: string }) {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(text);
        // Set checkmark icon for 2 seconds
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return <div>
        {isCopied
            ? (
                <span className="text-green-800"><Check size={16} /></span>
            )
            : (
                <TooltipProvider delayDuration={300}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className={`text-gray-500 hover:bg-gray-100`} onClick={copyToClipboard}>
                                <Copy size={16} />
                                <span className="sr-only">Copy</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-black text-white">
                            <TooltipArrow />
                            <p>Copy</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        }
    </div>
}