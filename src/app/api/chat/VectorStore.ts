import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

export const retrieveDocuments = async (query: string) => {
  const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: process.env.QDRANT_URL,
    collectionName: process.env.QDRANT_COLLECTION
  });
  
  const k = Number(process.env.VECTOR_STORE_SEARCH_K|| 5);
  
  return vectorStore.similaritySearch(query, k);
}
