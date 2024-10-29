+++
title = 'Chains and Retriever'
date = 2024-10-28T18:49:37+08:00
draft = false
weight = 6
+++


LangChain can easily orchestrate interactions with language models, chain together various components, and incorporate resources like databases and APIs. We will examine two fundamental ideas in LangChain in this chapter: Chain and Retriever.

#### Understanding Chains

LangChain relies heavily on chains. The core of LangChain's operation is these logical relationships among one or more LLMs. Depending on the requirements and LLMs involved, chains might be simple or complex. An LLM model, an output parser that is optional, and a `PromptTemplate` are all part of its organized configuration. The `LLMChain` in this configuration takes in a variety of input parameters. It converts these inputs into a logical prompt by using the `PromptTemplate`. The model is then fed this polished cue. Following receipt of the output, the `LLMChain` formats and further refines the result into its most useable form using the `OutputParser`, if one is supplied.

{{< plantuml >}}
folder chain {
    artifact input_variables
    artifact PromptTemplate
    artifact LLM
}

input_variables -> PromptTemplate
PromptTemplate -> LLM

folder prompt {
    artifact "prompt = PromptTemplate(\n    input_variables=["city"],\n    template="Describe a perfect day in {city}?"\n)"
}

folder chain.invoke {
artifact "chain = LLMChain(\n    llm=llm, prompt=prompt\n)\nprint(chain.invoke("Paris"))"
}

chain -[hidden]- prompt
prompt -[hidden] chain.invoke
{{< /plantuml >}}

Figure 2.4: Chain in Process

To demonstrate LangChain's capability for creating simple chains, here is an instance utilizing the `HuggingFaceEndpoint` class.

First the code imports `PromptTemplate` from `langchain.prompts` and defines a prompt using the template "Describe a perfect day in {city}?" where `{city}` is a variable placeholder. It imports an LLM from Hugging Face using `HuggingFaceEndpoint`, specifying the model repository id as `mistralai/Mistral-7B-Instruct` and setting model parameters like `temperature` and `max_new_token`. Then the code imports `LLMChain` from `langchain.chains` and creates a chain (`llmchain`) by combining the selected LLM (mistral) and the defined prompt. Finally, it invokes the chain with a query "Paris" using `llmchain.invoke("Paris")` and prints out the result.

(TL;DR

Consider reading the following chapter to efficiently configure your environment for running the provided code examples.)

```py
from langchain.prompts import PromptTemplate
prompt = PromptTemplate(
    input_variables=["city"],
    template="Describe a perfect day in {city}?")

from langchain_community.llms import HuggingFaceEndpoint
repo_id = "mistralai/Mistral-7B-Instruct-v0.2"
llm = HuggingFaceEndpoint(
    repo_id=repo_id, max_new_tokens=250, temperature=0.5
)

from langchain.chains import LLMChain
llmchain = LLMChain(llm=llm, prompt=prompt, verbose=True)

print(llmchain.invoke("Paris"))
```

In summary, this code sets up a scenario where an LLM model is prompted to describe a perfect day in Paris based on the defined template and model settings. You see the output varies while changing the setting of `temperature`. I enabled `verbose` mode to showcase a more comprehensive display of detailed steps and information in the output.

```py
Token is valid (permission: read).
Your token has been saved to /home/jeff/.cache/huggingface/token
Login successful

> Entering new LLMChain chain...
Prompt after formatting:
Describe a perfect day in Paris?

> Finished chain.

{'city': 'Paris', 'text': "\n\nA perfect day in Paris would begin with waking up early in a charming apartment located in the heart of the city. After a quick breakfast at a local bakery, I would head out to explore the beautiful Montmartre district, taking in the breathtaking views of the city from the top of the Sacré-Cœur.\n\nNext, I would stroll through the picturesque streets of Le Marais, stopping to admire the historic architecture and browse the trendy boutiques. I would then make my way to the Louvre Museum to spend the afternoon exploring the countless works of art housed within its walls.\n\nAs the sun begins to set, I would take a leisurely boat ride along the Seine River, taking in the stunning views of the city's iconic landmarks such as the Eiffel Tower and Notre-Dame Cathedral. I would then enjoy a delicious dinner at a quintessential Parisian bistro, accompanied by a glass of fine French wine.\n\nThe evening would be spent exploring the vibrant nightlife of the city, perhaps catching a cabaret show or dancing the night away at a trendy club. Finally, I would"}
```

Next, we will delve into employing a retriever to fetch data from an established VectorStore. This process ensures that the retrieved data originates exclusively from the designated VectorStore source. When both the LLM and VectorStore reside within a private network, all information involved in retrieval and result generation remains secure and private. Such practices effectively address security and privacy considerations within enterprise environments.

#### Understanding Retrievers

In LangChain, a retriever acts as a pivotal component responsible for fetching relevant information from a knowledge base or content source in response to user queries.

RAG, short for Retrieval Augmented Generation, is a method employed to integrate additional, often confidential or current data into the knowledge of LLMs. While LLMs demonstrate proficiency in analyzing diverse subjects, their expertise is limited to publicly accessible data present during their training phase. To enable AI applications to reason over private or post-training data effectively, it is imperative to supply the model with precise information to expand its knowledge. RAG entails retrieving pertinent data and seamlessly incorporating it into the model prompt.

#### Utilizing Chains and Retrievers in LangChain

Combining chains and retrievers in LangChain allows for the creation of intricate workflows that process user input, obtain pertinent data, and produce output.

When a new question is received, the chain can be utilized to process it, produce a prompt, and use the retriever to get relevant data from the knowledge base. A response can then be produced using the information that was retrieved.

The following diagram outlines the intricate process:

- Initially, load the document, then split and embed it in a vectorstore, which serves as the retriever for subsequent retrieval in the RAG step.

- Utilize the `HuggingFacePipeline` to load the Transformers language model for embedding.

- Merge the steps with a customizable prompt to create a chain structure, typically followed by inclusion in the chain using the `RunnablePassthrough` class to generate the answer.


{{< plantuml >}}
folder documents {
    artifact document_loaders
    artifact text_splitter
}

folder retrievers {
    artifact embeddings
    artifact vectorstore
    artifact retriever
}

folder rag_chain {
    artifact RunnablePassthrough
    folder prompt_template {
        artifact prompt
    }
    folder llm {
        artifact HuggingFaceEndpoint
    }
}

file answer

document_loaders -> text_splitter
text_splitter --> embeddings
embeddings -> vectorstore
vectorstore -> retriever

retriever -[hidden]- rag_chain
retriever --> RunnablePassthrough
RunnablePassthrough -> prompt
prompt --> HuggingFaceEndpoint
HuggingFaceEndpoint -> answer
{{< /plantuml >}}

Figure 2.5: Chain of RAG

In conclusion, LangChain's chains and retrievers offer an adaptable and potent approach to developing LLM-based applications. These tools enable developers to design intricate processes that manage user input, obtain relevant data, and provide output.

Here is an example of how to use a retriever in LangChain. In this example, the code performs the following steps:

- Utilizes a sentence-transformers embedding model to embed data fetched from a website, subsequently inserting the embedded data into a FAISS VectorStore.

- Retrieves relevant data from the retriever (the VectorStore) and processes it through a RAG chain using the `RunnablePassthrough` library to reach the LLM, incorporating a predefined prompt, and generates the answer.

Let’s go through it step by step.

Load a document from the web, through `WebBaseLoader` class, split it into small chunks

```py
from langchain_community.document_loaders import WebBaseLoader
loader = WebBaseLoader("https://en.wikisource.org/wiki/Hans_Andersen%27s_Fairy_Tales/The_Emperor%27s_New_Clothes")
document = loader.load()

from langchain.text_splitter import RecursiveCharacterTextSplitter
splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
chunks = splitter.split_documents(document)
```

Load the embedding model.
```py
from langchain_community.embeddings import HuggingFaceEmbeddings
embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
```


The `from_documents` method is used to initialize the FAISS VectorStore with the given chunks and embedding. Subsequently, the code converts this VectorStore into a retriever object using the `as_retriever()` method.

```py
from langchain_community.vectorstores import FAISS
vectorstore = FAISS.from_documents(chunks, embedding)
retriever = vectorstore.as_retriever()
```

Define prompt with `ChatPromptTemplate` method.
```py
from langchain.prompts import ChatPromptTemplate
template = """You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
Question: {question}
Context: {context}
Answer:
"""
prompt = ChatPromptTemplate.from_template(template)
```

Use the `google/flan-t5-xxl` model through the Hugging Face platform's `HuggingFaceEndpoint` method remotely. Specify the model's keyword arguments to customize settings such as `temperature` and `max_new_token`. Utilizing `HuggingFaceEndpoint` allows you to leverage the computational resources provided by Hugging Face, eliminating the need for substantial local computing capacity. You may also experiment with Mistral's model to observe variations in generation quality.

```py
from langchain_community.llms import HuggingFaceEndpoint
repo_id="google/flan-t5-xxl"
# repo_id = "mistralai/Mistral-7B-Instruct-v0.2"
llm = HuggingFaceEndpoint(
    repo_id=repo_id, max_new_tokens=250, temperature=0.5)
```

The RAG chain combines the context retrieved from the `retriever`, the question, the `prompt`, and the language model to produce an answer using the `RunnablePassthrough` method. This chain is both straightforward and engaging in its approach.

```py
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

query = "What is this story telling about?"
print(rag_chain.invoke(query))
```

The output will display:
```sh
The emperor's new clothes
```

The code presented above is straight-forward yet provides a comprehensive, direct, and lucid sequence to manage the entire process:

- Extracting a document from the web, splitting it into smaller parts, and storing them in a VectorStore.

- Establishing a retriever with the VectorStore.

- Tailoring a prompt.

- Employing an LLM from `HuggingFaceEndpoint` method.

- Integrating all the components mentioned above into a coherent chain.
