import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ReasonDetails = ({ onSubmit }: { onSubmit: (comment: string) => void }) => {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const details = formData.get('details') as string;
                onSubmit(details);
            }}
        >
            <Textarea
                name="details"
                autoFocus={true}
                placeholder="(Optional) please tell us more..."
                maxLength={500}
            />
            <div className="flex gap-2 justify-end mt-2 mr-2">
                <Button size="sm" type="button" onClick={() => onSubmit('')} variant="ghost">Cancel</Button>
                <Button size="sm" value="submit" variant="outline">Submit</Button>
            </div>
        </form>
    )
}

export default ReasonDetails;
