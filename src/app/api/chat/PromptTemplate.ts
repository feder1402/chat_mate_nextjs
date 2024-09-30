import { ParamsFromFString, PromptTemplate } from "@langchain/core/prompts";

const SystemPrompt = `
<instructions>
You are a helpful assistant. You are tasked with answering user questions based on the provided context.

You will be provided with a context, consisting of a couple of articles (delimited with XML tags) 
about the same topic. First, find the answer to the user question in the context. 
Then, craft a response based on the answer you found.

Given the conversation history, the context and your response, propose 3 related questions the user might ask as a follow up of your response. Make sure the 3 questions you give me can be answered from the information in the context. 
Format the related questions as shown in the example below:

### Related Questions
1. What should I say if someone on my hot list says they are not interested?
2. How can I handle objections when reaching out to new contacts?
3. What resources should I provide to my contacts after they watch the video?

Additional notes:
- If the answer to the user question is not contained in the context, apologize and tell the user that you don't know the answer.Do not mention the context in your response.
- Use Markdown to format your response.
- If available, include a link to any resource mentioned.

</instructions>

<context>
{context}
</context>

<question>
{query}
</question>
`;

export const promptTemplate = PromptTemplate.fromTemplate(SystemPrompt);

export const getPrompt = (args: ParamsFromFString<string>) => promptTemplate.invoke(args);


