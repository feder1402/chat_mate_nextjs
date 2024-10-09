import { ParamsFromFString, PromptTemplate } from "@langchain/core/prompts";

const UserPrompt = `
<history>
{history}
</history>

<context>
{context}
</context>

<question>
{query}
</question>
`;

export const promptTemplate = PromptTemplate.fromTemplate(UserPrompt);

export const getPrompt = (args: ParamsFromFString<string>) => promptTemplate.invoke(args);


