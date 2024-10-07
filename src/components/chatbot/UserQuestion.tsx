import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRef } from "react"

type UserQuestionProps = {
    onSubmit: (payload: string) => void
    isLoading?: boolean
}

export default function UserQuestion({ onSubmit, isLoading }: UserQuestionProps) {
    const ref = useRef<HTMLFormElement>(null)

    return (
        <form
            ref={ref}
            onSubmit={(e) => {
                e.preventDefault()
                if (ref.current) {
                    const formData = new FormData(ref.current)
                    const message = formData.get('message') as string
                    ref.current.reset()
                    onSubmit(message)
                }
            }}
            className="flex gap-2 shadow-md"
        >
            <Label htmlFor="message" className="sr-only">Message</Label>
            <Input
                name="message"
                placeholder="Type your question here..."
                className=" bg-purple-50 text-black min-h-12 resize-none rounded-lg border focus-within:ring-1 focus-within:ring-ring focus-visible:ring-0"
            />
            <Button type="submit" size="lg" disabled={isLoading} className="min-h-12">
                Send
            </Button>
        </form>
    )
}
