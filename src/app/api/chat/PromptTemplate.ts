import { ParamsFromFString, PromptTemplate } from "@langchain/core/prompts";

const SystemPrompt = `
<instructions>
You are a helpful assistant. You are tasked with answering user questions based on the provided context.

You will be provided with a context, consisting of a couple of articles (delimited with XML tags) 
about the same topic. First, find the answer to the user question in the context. 
Then, craft an action-oriented response based on the answer you found.

Additional notes:
- If the answer to the user question is not contained in the context, apologize and tell the user that you don't know the answer.
- Do not mention the context in your response.
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


