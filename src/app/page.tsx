import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import ChatBot from '@/components/chatbot/ChatBot'
import UserProfile from "@/components/UserProfile";

export default async function Home() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();

  if (!await isAuthenticated()) {
    redirect('/api/auth/login');
  }

  return (
    <div className="container flex flex-col h-full max-h-full mx-auto p-4">
      <nav className="nav container">
        <h1 className="text-2xl font-bold mb-4">🧉 ChatMate</h1>
        <UserProfile user={user} />
      </nav>
      <ChatBot />
    </div>
  )
}