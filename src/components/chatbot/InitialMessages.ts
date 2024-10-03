import { ChatMessageType } from "@/types/ChatTypes";

const BOT_WELCOME = `
Hey there! 👋 I'm ChatMate, your friendly assistant, here to help you on your journey as a LegalShield associate!

I'm ready to answer your questions and provide useful information. Here are some of the things I can help you with:

* **All About LegalShield**
    *  I can tell you about LegalShield's history, mission, and values.
    *  Have questions about the LegalShield and IDShield plans? I can provide you with details.

* **Your Associate Journey**
    *  Need help getting started as a LegalShield associate? I can offer some guidance.
    *  I can share tips and resources to help you build your business.
    *  Curious about the compensation plan, incentives, and promotions? Just ask!
    *  I can direct you to resources and tools available to associates.

* **Other Cool Stuff**
    *  Need info on the Prospect by PPLSI Mobile App or LSEngage? I can help.
    *  I can also share some of Darnell's experiences and advice taken from his talks.

Before we start, I would like to ask for your help. I'm still learning, so your feedback is important! 
Please use the thumbs up 👍 and thumbs down 👎 buttons after my responses to let me know how I can be more helpful.

So, without further ado: is there anything specific you'd like to talk about?
`

const initialMessages: ChatMessageType[] = [
    { role: 'bot', content: BOT_WELCOME }
]

export default initialMessages;