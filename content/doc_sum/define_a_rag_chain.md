+++
title = 'Define a RAG Chain'
date = 2024-10-28T21:09:57+08:00
draft = false
weight = 4
+++

#### Using `PyPDFLoader` and `DirectoryLoader` to load the multiple PDF documents from a specific directory


The example provided utilizes two components:
- `PyPDFLoader`: This tool is used to load and parse PDF documents.
- `DirectoryLoader`: This component enables the simultaneous processing of multiple PDF files from a specific directory.

As an example, the following PDF document was randomly downloaded:
https://ufdcimages.uflib.ufl.edu/AA/00/01/16/99/00001/WorldHistory.pdf

Copy this file to your project or any directory you like. In my case, I leave it in `/tmp`. This PDF file will be used to demonstrate the functionality of the `PyPDFLoader` and `DirectoryLoader` tools.


```py
## Load PDF documents from a directory
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
loader = DirectoryLoader('/tmp/', glob="**/*.pdf", loader_cls=PyPDFLoader,
                         show_progress=True, use_multithreading=True)
## Sample code for loading doc from web
# from langchain_community.document_loaders import WebBaseLoader
# loader = WebBaseLoader("https://en.wikisource.org/wiki/Hans_Andersen%27s_Fairy_Tales/The_Emperor%27s_New_Clothes")
documents = loader.load()
```

I have retained an example showcasing the use of `WebBaseLoader` to directly load documents from a website for your reference.

#### Split the document into smaller chunks

<!-- For generic text, this text splitter is the one that is advised.  -->

A list of characters is used as its parameter. Until the chunks get tiny enough, it tries to divide them sequentially. Specifically, for `RecursiveCharacterTextSplitter`, list `["\n", "\n", " ", ""]` is the default. Because paragraphs and sentences are generally thought to be the strongest semantically related parts of text, this has the effect of striving to keep all of them together for as long as possible. You can use the document as a reference to view further `TextSplitter` functions that are accessible > https://python.langchain.com/docs/modules/data_connection/document_transformers

```py
## Split the documents into chunks
from langchain.text_splitter import RecursiveCharacterTextSplitter
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
docs = splitter.split_documents(documents)
```

#### Specify the embedding model

```py
from langchain_huggingface import HuggingFaceEmbeddings
embedding = HuggingFaceEmbeddings(
    # model_name = "sentense-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    model_name = "sentence-transformers/all-mpnet-base-v2"
)
```

<!-- As we are using a locally installed open-source embedding model, we have the flexibility to set a large value for the token's `chunk_size` at no cost.

I prefer using the `paraphrase-multilingual-MiniLM-L12-v2 model`, which is 477MB on disk. It is small yet powerful. -->

Numerical machine learning representations of the semantics of the input data are called embeddings. They convert complicated, high-dimensional data, such as text, photos, or audio, into vectors that represent their meaning. Enabling more effective data processing and analysis using algorithms.

Since we are utilising an open-source embedding model that can be deployed locally, we can freely set the token's `chunk_size` to a greater amount.

The `paraphrase-multilingual-MiniLM-L12-v2` model, requiring 477MB of disc space, is the one I like to use. It is compact, strong, and capable. I also include `bert-base-multilingual-cased` embedding model as reference, which I used for production as well.

`all-MiniLM-L6-v2` is an additional embedding model that I can suggest for testing while developing an application. It is quite compact, weighing in at just 90 MB.

Hugging Face has a tonne of alternative and open source embedding models available > https://huggingface.co/models?sort=downloads&search=embedding

#### Save the embedded data into VectorStore

A Vector Database, or vector store, stores vectors (fixed-length number lists) and other data. It employs Approximate Nearest Neighbor (ANN) algorithms for searching with query vectors. Vectors represent data in a high-dimensional space, with each dimension corresponding to a feature. They are used for various data types and can be computed using machine learning methods. Vector databases support tasks like similarity search, multi-modal search, and large language models. They are also integral to Retrieval-Augmented Generation (RAG), enhancing domain-specific responses of large language models by querying relevant documents based on user prompts.

```py
## Configure Qdrant client, and define vectorstore and retriever
from langchain_qdrant import QdrantVectorStore
url = "http://127.0.0.1:6333"
vectorstore = QdrantVectorStore.from_documents(
    docs,
    embedding,
    url = url,
    collection_name = "worldHist",
)
retriever = vectorstore.as_retriever()
```

In this code snippet, I am utilizing the Qdrant vector database, which is launched via Docker, with persistent data storage located at `/$DIR/qdrant_storage`.

Further elaboration on these open-source alternatives to VectorStore will be provided in upcoming chapters. Additional options include FAISS, Chroma and Pinecone, the latter of which boasts excellent documentation from my personal perspective.

Reminder: re-executing `QdrantVectorStore.from_documents` will insert the embedded data into the vector database (VectorStore), resulting in duplication of the data. This operation only needs to be run once to insert the chunked documents into the VectorStore.

You can find more information about Qdrant at https://qdrant.tech/documentation/quick-start and https://python.langchain.com/docs/integrations/vectorstores/qdrant .

#### Configure `PromptTemplate` and `Prompt`

This template is designed for question-answering tasks. The template consists of several placeholders that will be filled in dynamically when the template is used:

`{question}`: this placeholder will be replaced with the actual question that the user wants to have answered.
`{context}`: this placeholder will be replaced with the relevant context or information that the language model can use to formulate the answer.

The template instructs the language model to use the provided context to answer the question concisely, within a maximum of three sentences. If the language model is unable to provide a definitive answer, it should simply state that it doesn't know.

<!-- ```py
from langchain.prompts import PromptTemplate
prompt_template = """Write a concise summary of the following: "{context}" CONCISE SUMMARY: """
prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
``` -->

```python
from langchain.prompts import ChatPromptTemplate
template = """You are an assistant for question-answering tasks. Use the
following pieces of retrieved context to answer the question. If you don't know
the answer, just say that you don't know. Use three sentences maximum and keep
the answer concise.
Question: {question}
Context: {context}
Answer:
"""
prompt = ChatPromptTemplate.from_template(template)
```

For more comprehensive information, I recommend visiting https://python.langchain.com/docs/expression_language/cookbook/prompt_llm_parser.

Please be aware that the effectiveness of prompts and their templates can vary significantly across different models. Essentially, the language model (LLM) might not always interpret the prompt and its template as intended. It may be necessary to dedicate some time to experimentation and testing to achieve the desired results.

#### Load `Mistral` model

The following code snippet demonstrates the Ollama, acting as a middleware for Large Language Models (LLMs). It instantiates the Ollama class and specifies the particular LLM to be utilized.

My experience with the Mistral language model in real projects has shown it to deliver exceptional semantic optimization capabilities. In our project, we explored and tested approximately 30+ different models, including Gemma, GPT4All and GPT-2, etc, open-sourced from the HuggingFace platform. I'll cover these in this book.

To get `mistral` model loaded and run, you can execute the following command:
```sh
ollama pull mistral
ollama run  mistral
```

You can check what exact model(s) pulled:
```sh
ollama list
NAME                   	ID          	SIZE  	MODIFIED
gemma:2b               	b50d6c999e59	1.7 GB	8 days ago
mistral:7b         	61e88e884507	4.1 GB	2 weeks ago
```

To evaluate the performance and quality of this model through Ollama, let's proceed with Ollama. Further in this guide, I will introduce additional LLMs directly from LangChain, without the use of Ollama.

```py
from langchain_ollama import ChatOllama
llm = ChatOllama(
    model="mistral",
    temperature=0.5,
)
```

Before executing the code, it's crucial that Ollama is started. On Linux systems, you can verify and initiate the process

```sh
systemctl status  ollama
systemctl restart ollama
```

To initiate the process on macOS, simply click on the Ollama icon that appears after installation.

#### Enable debug and verbose mode (optional)
```py
from langchain.globals import set_verbose, set_debug
set_debug(True)
set_verbose(True)
```

Enabling debug and verbose mode can print the detailed chain step by step. It's essential to debug when having issue.

<!-- #### RAG with `RetrievalQA` function

```py
from langchain.chains import RetrievalQA
qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=vectordb.as_retriever(), chain_type="stuff",
        chain_type_kwargs={"prompt": prompt},
        return_source_documents=True)

from langchain.chains import RetrievalQA
response = qa_chain("please summarize this book")
# response = qa_chain("what happened to the emperor?")
``` -->

#### Start an RAG Chain

An RAG chain is a type of LangChain that combines a retriever (to fetch relevant context) and a language model (to generate the output).

The `rag_chain` is defined using the LangChain's pipe (`|`) operator, which allows you to compose multiple components into a single chain.

`{"context": retriever, "question": RunnablePassthrough()}`: This is the first component of the chain, which is a dictionary. The `context` key is assigned the retriever object, which is likely a component that retrieves relevant context for the given input. The `question` key is assigned a `RunnablePassthrough` object, which means the input question will be passed through the chain without modification.
`| prompt`: This component is likely a `prompttemplate` or a prompt-related component that prepares the input for the language model.
`| llm`: This is the language model component, which will generate the output based on the prepared input.
`| StrOutputParser()`: This is the final component of the chain, which is an output parser that expects the output to be a string. This ensures that the final output of the chain is a string.

<!-- Once the rag_chain is defined, you can use it in your LangChain-based application to perform tasks such as question answering, text generation, or any other natural language processing task that requires the combination of a retriever and a language model.
The specific implementation and usage of the rag_chain will depend on the rest of your application's logic and the specific components (retriever, prompt, language model) that you have set up. -->


```py
## Create an RAG chain
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)
```

#### Start an interactive loop of question and answer

This Python code snippet demonstrates a simple interactive loop that allows the user to ask questions and receive responses from the `rag_chain` defined in the previous code example.

Let's break down the code step by step:
`while True:`: This starts an infinite loop that will continue until the user decides to exit.
`user_input = input("Enter your question: ")`: This line prompts the user to enter a question, and the user's input is stored in the user_input variable.

`if user_input == "exit":`: This checks if the user's input is the string "exit". If it is, the loop will be terminated using the break statement.

`else:`: If the user's input is not "exit", the code inside the else block will be executed.
`print(rag_chain.invoke(user_input))`: This line invokes the rag_chain defined in the previous code example, passing the user's input as the argument. The output of the rag_chain is then printed to the console.

The overall flow of this code is as follows:
- The user is prompted to enter a question.
- If the user enters "exit", the loop is terminated, and the program ends.
- If the user enters any other input, the `rag_chain` is invoked with the user's input, and the output is printed to the console.
- The loop then repeats, prompting the user for another question.


```py
while True:
    user_input = input("Enter your question: ")
    if user_input == "exit":
        break
    else:
        print(rag_chain.invoke(user_input))
```

#### The output is like the following with the detailed chains' information

Remember, you must copy one or more PDF documents into the loading directory.

```py
100%|███████████████████████████████████████████████████████████████| 1/1 [00:06<00:00,  6.58s/it]
Enter your question: tell me about the history of italy
 Italy's history includes a final war for unity over the Italian peninsula in 91 BC, which ended with Roman citizenship decree for all Italians. The classical Latin language emerged around this time and held sway for about 300 years. In the Middle Ages, northern Italy was subject to German rule while southern Italy and Sicily prospered under the Normans, who allowed free choice of religion. Frederick II, grandson of Frederick Barbarossa and Norman Roger II, became emperor of Rome in 1220, dividing his time between managing affairs in both Italy and Germany, and founding the University of Naples and enlarging the medical school at Salerno. Eastern and southern Italy remained Byzantine in culture, while the rest of the peninsula developed a new civilization, language, religion, and art from its Roman heritage.
Enter your question:
```



#### The Code for Query Only

Given that the embedded data could be generated multiple times if the code continues to run, I've developed the following code snippet to define VectorStore client, without inserting the embedded data, and prevent the duplication of embedded data in VectorStore. When defining vectorstore, use `QdrantVectorStore.from_existing_collection` instead of `QdrantVectorStore.from_documents`

```python
from langchain_qdrant import QdrantVectorStore
vectorstore = QdrantVectorStore.from_existing_collection(
    embedding = embedding,
    url = "http://127.0.0.1:6333",
    collection_name = "worldHist",
)
retriever = vectorstore.as_retriever()
```


The following is the full code with Qdrant vectorstore, for example:

```python
## Define embedding model
from langchain_community.embeddings import HuggingFaceEmbeddings
embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

## Configure Qdrant client, and define vectorstore and retriever
from langchain_qdrant import QdrantVectorStore
vectorstore = QdrantVectorStore.from_existing_collection(
    embedding = embedding,
    url = "http://127.0.0.1:6333",
    collection_name = "worldHist",
)
retriever = vectorstore.as_retriever()

## Define prompt and prompttemplate
from langchain.prompts import ChatPromptTemplate
template = """You are an assistant for question-answering tasks. Use the
following pieces of retrieved context to answer the question. If you don't know
the answer, just say that you don't know. Use three sentences maximum and keep
the answer concise.
Question: {question}
Context: {context}
Answer:
"""
prompt = ChatPromptTemplate.from_template(template)

## Define LLM
import os
HUGGINGFACEHUB_API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")

from langchain_ollama import ChatOllama
llm = ChatOllama(
    model="mistral",
    temperature=0.5,
)

## Turn on debug mode
from langchain.globals import set_verbose, set_debug
set_debug(True)
set_verbose(True)

## Create an RAG chain
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

while True:
    user_input = input("Enter your question: ")
    if user_input == "exit":
        break
    else:
        print(rag_chain.invoke(user_input))
```
