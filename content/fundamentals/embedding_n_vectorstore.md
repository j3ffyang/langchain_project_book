+++
title = 'Embeddings and VectorStore'
date = 2024-10-28T18:17:09+08:00
draft = false
weight = 5
+++

In LangChain, a Python library designed to simplify the process of building Natural Language Processing (NLP) applications using LLMs, embeddings and VectorStore play a crucial role in enhancing the accuracy and efficiency of these applications.

#### Understanding Embeddings

In the realm of LLMs, embeddings serve as numeric depictions of words, phrases, or sentences, encapsulating their semantic meaning and context. These embeddings facilitate text representation in a machine-learning-friendly format, supporting a range of NLP endeavors. Commonly pretrained on vast text datasets, embeddings such as Word2Vec, GloVe, and FastText capture semantic connections and resemblances among words. By converting words into vectors, these embeddings streamline tasks like text analysis and generation, empowering models to comprehend and handle language proficiently by leveraging contextual cues.

I recommend dedicating some time to review an insightful document authored by Sascha Metzger, which elaborates on tokens, vectors, and embeddings in the field of natural language processing. The document can be accessed at https://saschametzger.com/blog/what-are-tokens-vectors-and-embeddings-how-do-you-create-them .

In the context of an LLM with LangChain, embeddings are used to capture the "meaning" of text. The closeness of two vectors indicates the degree of correlation between them, where shorter distances imply a stronger correlation, and longer distances suggest a weaker correlation.

Here is an example of how to create vector embeddings using the `sentence_transformers` library in Python: In this example, `embeddings.embed_query(text)` generates embeddings for the given text.

```py
# load embedding library
from langchain_community.embeddings import HuggingFaceEmbeddings

# define embedding with using sentence-transformers model from HuggingFace.co

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

text = "harry potter’s owl is in the castle."

# embed the given text
embed_text = embeddings.embed_query(text)

# print the first 3 embedding
print(embed_text [:3])

# print out the type of embeddings
print(type(embed_text))
```

The model utilized in this instance is the `paraphrase-multilingual-MiniLM` from sentence-transformers, known for its resilience, efficiency, and compact size of `477MB` for local storage. Despite various alternatives, this model is favored for its simplicity and effectiveness. Following the embedding procedure, the embedded data is going to be inserted into VectorStore, ensuring long-term persistence and readiness for subsequent `similarity-search` operations.


#### Understanding VectorStore

Understanding a VectorStore involves grasping its role in efficiently searching and comparing extensive sets of vectors, which are essential for AI applications by translating words into numerical representations to simplify sentence comparisons based on their semantic meanings.

- Functionality of VectorStore: In LangChain, the VectorStore serves as a repository for embeddings, enabling streamlined searches based on semantic similarity. Text undergoes embedding and is then stored in the VectorStore for long-term retention, preparing it for subsequent similarity inquiries.

- Variety of VectorStore options: LangChain offers support for vector databases as its primary index type, encompassing features like document loaders, text splitters, VectorStores , and retrievers. These databases contain individual nodes alongside their respective embeddings within a VectorStore.

Benefits of utilizing VectorStore: Integrating VectorStore in LangChain provides advantages such as efficient storage and retrieval of embeddings, facilitating quick and accurate similarity searches rooted in semantic relationships. By storing embeddings close to domain-specific datasets, seamless integration with additional metadata is enabled without external queries.

I will be presenting a variety of open-source VectorStores. Among the most popular in the LLM domain are FAISS, Qdrant, Pinecone, and Chroma. Each of these open-source vectorstore databases will be explored through sample code within this book.

#### Utilizing Embedding and VectorStore in LangChain

In LangChain, embedding and VectorStore collaboratively foster the creation of intelligent agents capable of interpreting and implementing human language commands. Initially, textual data is subjected to processing and transformation into embeddings via appropriate models. Subsequently, these embeddings are deposited in a VectorStore for expeditious retrieval.

Upon receipt of novel instructions or queries, the system may rapidly extract pertinent embeddings from the VectorStore, contrast them against the embeddings derived from the incoming command, and subsequently formulate a reply.

Below is an example of how this might manifest in code, employing the Sentence-Transformers library for embeddings and inserting the embeddings into FAISS open-source VectorStore, which is running in memory.

```py
# load embedding model

from langchain_community.embeddings import HuggingFaceEmbeddings
embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )

# load vectorstore library
from langchain_community.vectorstores import FAISS

# insert the embedded data into vectorstore in memory
vectorstore = FAISS.from_texts(
    ["harry potter's owl is in the castle"],
    embedding = embedding,
    )

print(vectorstore)
```


Once the embedded data is stored in VectorStore, we will explore the process of orchestrating retrieval and chaining to obtain responses from the LLM.
