import * as dotenv from "dotenv";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";

dotenv.config();

const loader = new DirectoryLoader("source_knowledge/associates", {
  ".txt": (path) => new TextLoader(path),
  ".md": (path) => new TextLoader(path),
});

async function loadDocuments() {
  const docs = await loader.load();
  return docs;
};

(async () => {
  console.log("Loading documents...");
  const docs = await loadDocuments();
  console.log(`Loaded ${docs.length} documents.`);

  console.log("Connecting to vector store...");
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });
  
  const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: process.env.QDRANT_URL,
    collectionName: process.env.QDRANT_COLLECTION,
  });

  console.log('Adding documents to vector store...');
  // Uncomment to add documents to the vector store
  //await vectorStore.addDocuments(docs);

  console.log('Sending test query...');
  const similaritySearchResults = await vectorStore.similaritySearch(
    "I'm a new associate. What should I do to be successful?",
    3
  );

  console.log(`Similarity search returned ${similaritySearchResults.length} documents.`);

  console.log("Finished generating storage.");
})();
