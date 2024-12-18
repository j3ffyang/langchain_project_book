+++
weight = 1
title = 'LangChain Architecture'
date = 2024-10-24T00:10:48-04:00
draft = false
+++

The architectural components of LangChain, illustrated in Figure 2.1, will be thoroughly explored and discussed in detail throughout the book. 


{{< plantuml >}}
package LangChain {
    package Agent_Tooling {
        agent Tools
        agent Toolkits
    }
    package Models_IO {
        agent Model
        agent Prompt 
        agent Output_Parser 
    }
    package Chain_and_Retrieval {
        agent Retriever
        agent Document_Loaders
        agent VectorStore
        agent TextSplitter
        agent Embedding_Model
    }
}

Chain_and_Retrieval -[hidden] Models_IO
Models_IO -[hidden] Agent_Tooling

Model -[hidden]- Prompt
Prompt -[hidden]- Output_Parser

Retriever -[hidden] Document_Loaders
Document_Loaders -[hidden]- VectorStore
VectorStore -[hidden] TextSplitter
TextSplitter -[hidden]- Embedding_Model

Tools -[hidden]- Toolkits
{{< /plantuml >}}



Figure 2.1: LangChain Architecture

- **Model**: also known as LLM model serve as the core elements of LangChain. They essentially act as wrappers for these models, enabling the utilization of their specific functionalities and capabilities. 
- **Chain**: Chain enables us to integrate multiple components to address a specific task. It streamlines the process of implementing complex applications by enhancing modularity, making debugging and maintenance more straightforward. 
- **Document loaders**: Document Loaders play a role in loading documents into the LangChain system, managing a range of document types like PDFs, and transforming them into a compatible format for LangChain processing. This procedure encompasses multiple stages, including data ingestion, context comprehension, and refinement. 
- **Prompt**: Prompts serve as inputs for LLMs to generate specific responses. Crafting effective prompts is vital for obtaining valuable outputs from LLMs. Prompt engineering aims to create prompts that yield precise, relevant, and beneficial responses from LLMs. For instance, the prompt plays an amazing role in the output when examining the prompt in OpenAI's Sora, which creates stunning and visually striking videos. 
- **VectorStore**: It brings functions for the effective storage and retrieval of vector embeddings. And it operates as a repository for vectors containing supplementary data, streamlining the processes of storage, search, and point management.
- **Output Parsers**: The `output_parser` converts the output of an LLM into a more appropriate format, especially beneficial when generating structured data using LLMs. 
- **Agents**: LLMs can communicate with their surroundings through agents. For instance, carrying out a particular task via an external API, or grabbing extra data from outside website. 

LangChain utilizes a sequential pipeline method to construct tailored applications for LLM. This structured approach integrates diverse services, data inputs, and formatting processes, ensuring accurate processing and consistent output. Modules in LangChain follow a step-by-step process with single inputs and outputs, facilitating smooth data flow. This mechanism simplifies development and enhances LLM utilization. By streamlining workflows, LangChain optimizes AI application development, executing steps in a specific order to real-world processes for managed outcomes. 

### LangChain Workflow

Having grasped the fundamental elements of LangChain, let's observe its process in detail and how the message is handled. The actual scenarios can change the workflow's logic depending on the requirements. A very common conversation flow is shown in Figure 2.2, which includes `document_loaders`, data embedding into vectorstore, and query `similarity_search` within `RetrievalQA` chain, then returns the analyzed result to the user.

{{< plantuml >}}
actor user
component Load_Docs
component Query
component LLM_generates_answer

package LangChain {
    component Document_Loaders
    component CharacterTextSplitter
    component embeddings
    component PromptTemplate
    component RetrievalQA
}

Load_Docs -> Document_Loaders
user -> Query
Query -> RetrievalQA

Document_Loaders -> CharacterTextSplitter
CharacterTextSplitter --> embeddings
PromptTemplate <- embeddings
PromptTemplate --> RetrievalQA
RetrievalQA -> LLM_generates_answer

Load_Docs -[hidden]- user
Query -[hidden]- LLM_generates_answer
{{< /plantuml >}}

Figure 2.2: LangChain Workflow

<!-- Let’s discuss these steps in detail. I've included the Python code for a very popular and typical module to demonstrate the components. The intricacies of real projects will be covered in detail in the upcoming chapters. To run the Python code provided, it is required to set up a working environment, a procedure that will be elaborated on in the upcoming chapter. You can promptly proceed to the next chapter to configure your development environment, ensuring the necessary libraries are installed and properly set up for the successful execution of the sample code presented here. -->

Let’s discuss these steps in detail. I've included the Python code for a set of typical modules to demonstrate the components. The real projects will be covered in detail in the upcoming chapters. To run the Python code provided, it is required to set up a working environment, a procedure that will be elaborated on in the upcoming chapter. You can directly proceed to the next chapter to configure your development environment, ensuring the necessary libraries are installed and properly set up for the successful execution of the sample code presented here.

- `document_loaders` can load, extract data from diverse sources and transform it into structured documents. It can handle `*.txt` (plain text) and `*.xls` (Microsoft Excel), load the HTML content from any website. Here's an example of loading data from Wikipedia through `WebBaseLoader`

  ```py
  from langchain_community.document_loaders import WebBaseLoader

  loader = WebBaseLoader("https://en.wikipedia.org/wiki/Text_file")
  document = loader.load()
  ```

- LangChain uses the `TextSplitter` class to break down the document into smaller chunks that can be more easily processed by the language model. One of the most used splitters, `RecursiveCharacterTextSplitter`, divides a large text into chunks based on a defined size, using a set of characters. By default, it utilizes characters like `["\n\n", "\n", " "]`, and `[""]`. Initially, it attempts to split the text using "`\n\n`". If the resulting chunks are still too large, it progresses to the next character, "`\n`", for further splitting. This process continues through the set of characters until a split smaller than the specified chunk size is achieved. The `chunk_size` parameter controls the max size of the final documents, and the `chunk_overlap` parameter specifies how much overlap there should be between chunks.

  ```py
  from langchain.text_splitter import RecursiveCharacterTextSplitter

  splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
  docs = splitter.split_documents(document)
  ```

- LangChain uses a VectorStore to create `embeddings` for each document split. These `embeddings` are numerical representations of the text that can be used for efficient information retrieval. The provided code snippet utilizes the `all-mpnet-base-v2` model from `HuggingFaceEmbeddings` by default. If not explicitly specified, this model is used. Additionally, the code operates with a vector store based on Qdrant, running in memory. (Please be aware that the vector store we have just set up operates in memory, which implies that all data will be lost when your computer is turned off. The advantage of utilizing a memory-based vector store is the ability to swiftly test your code without the need to save it. We will delve into persistent storage for production purposes in upcoming chapters). The collection is named `wikipedia` in vectorstore.

  ```py
  from langchain_huggingface import HuggingFaceEmbeddings
  model_name = "sentence-transformers/all-mpnet-base-v2"
  model_kwargs = {'device': 'cpu'}
  encode_kwargs = {'normalize_embeddings': True}
  embedding = HuggingFaceEmbeddings(
      model_name = model_name,
      model_kwargs = model_kwargs,
      encode_kwargs = encode_kwargs,
  )
  
  from langchain_community.vectorstores import Qdrant
  
  vectorstore = Qdrant.from_documents(
      docs,
      embedding = embedding,
      location = ":memory:",
      collection_name = "wikipedia",
  )
  print(vectorstore)
  ```

- Subsequently, the VectorStore is employed to conduct a `similarity_search` on the document embeddings, aiming to identify the documents most pertinent to the user's query. The search provides relevance scores for the query and outputs 2 results.

  ```py
  query = "What's flatfile?"
  result = vectorstore.similarity_search_with_score(query, k=2)
  print(result)
  ```

- To make foundation models useful for domain-specific tasks, the Retrieval Augmented Generation (RAG) framework augments prompts with external data from multiple sources, including document repositories, databases, or APIs. In a later chapter, we will examine how RAG functions in actual projects. For the time being, this is a brief excerpt of RAG code that illustrates how retrieval functions to obtain data from vectorstore using meaning rather than keywords.

  ```py
  query = "What is flatfile?"
  retriever = vectorstore.as_retriever()
  print(retriever.get_relevant_documents(query)[0])
  ```

The entire code, for instance, looks like this:

```py
from bs4 import BeautifulSoup
from langchain_community.document_loaders import WebBaseLoader

loader = WebBaseLoader("https://en.wikipedia.org/wiki/Text_file")
document = loader.load()

from langchain.text_splitter import RecursiveCharacterTextSplitter
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
docs = splitter.split_documents(document)

from langchain_huggingface import HuggingFaceEmbeddings
model_name = "sentence-transformers/all-mpnet-base-v2"
model_kwargs = {'device': 'cpu'}
encode_kwargs = {'normalize_embeddings': True}
embedding = HuggingFaceEmbeddings(
    model_name = model_name,
    model_kwargs = model_kwargs,
    encode_kwargs = encode_kwargs,
)

from langchain_community.vectorstores import Qdrant

vectorstore = Qdrant.from_documents(
    docs,
    embedding = embedding,
    location = ":memory:",
    collection_name = "wikipedia",
)

query = "What's flatfile?"
result = vectorstore.similarity_search_with_score(query, k=2)

retriever = vectorstore.as_retriever()
print(retriever.get_relevant_documents(query)[0])
```

The above code snippet goes through the following steps to process the document

- Load a document, and split it into smaller chunks
- Insert the splitted chunks into VectoreStore, which is configured as running in memory. You may want to persist it in production
- Create a query, then send it to VectorStore for similarity_search
- Retrieve the relevant document

The flow is straight forward and simple. The code in the previous example follows a fundamental flow, incorporating VectorStore with embeddings but not yet involving LLM. Our next step is to introduce an LLM into the process.
