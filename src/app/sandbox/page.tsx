import Comment from "@/components/thumbs_feedback/Reason";
import ThumbStateView from "@/components/thumbs_feedback/ThumbStateView";
import Sandbox from "./Sandbox";

export default async function SandboxPage() {

  return (
    <>
    <h1 className="text-2xl text-center font-bold mb-4">Sandbox</h1>
    <div className="container flex flex-col h-full max-h-full mx-auto p-4">
        <Sandbox />
    </div>
    </>
  )
}