+++
title = 'Complete Code'
date = 2024-10-28T22:36:51+08:00
draft = false
weight = 8
+++


I've divided the code into two sections because the data source is loaded into the vector store only once. After this initial load, queries can be executed against the existing vector store.

- Load the data into the vector store
- Query against the vector store

#### Loading the Data and Creating VectorStore

```py
import bs4
from langchain_community.document_loaders import WebBaseLoader
loader = WebBaseLoader(
    web_paths=("https://andersen.sdu.dk/vaerk/hersholt/TheEmperorsNewClothes_e.html",),
    bs_kwargs=dict(
        parse_only=bs4.SoupStrainer(
            class_=("post-content", "post-title", "post-header")
        )
    ),
)
documents = loader.load()

from langchain.text_splitter import RecursiveCharacterTextSplitter
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
chunks = splitter.split_documents(documents)


from langchain_huggingface.embeddings import HuggingFaceEmbeddings
embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)


import os
import getpass
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

from langchain_community.vectorstores import SupabaseVectorStore
from supabase.client import Client, create_client
supabase_url = SUPABASE_URL
supabase_key = SUPABASE_SERVICE_KEY
supabase_client = create_client(supabase_url, supabase_key)

# create a new collection
vectorstore = SupabaseVectorStore.from_documents(
    chunks,
    embedding = embedding,
    client = supabase_client,
    table_name = "documents",
    query_name = "match_documents",
    chunk_size = 500,
)
```

#### Querying

For convenience, I've included the values of `supabase_url` and `supabase_key` directly in the code to bypass the need for manual input during queries. However, it's crucial to ensure these keys are not exposed when sharing the code with others or when pushing it to a public GitHub repository.

The definition of `vectorstore` differs a little from its counterpart in the loading section because, during **querying**, there's no need to insert chunks into the vector store.


```py
from langchain_community.vectorstores import SupabaseVectorStore
from supabase.client import Client, create_client
supabase_url = "http://127.0.0.1:8000"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE"
supabase_client = create_client(supabase_url, supabase_key)

vectorstore = SupabaseVectorStore(
    embedding=embedding,
    client=supabase_client,
    table_name="documents",
    query_name="match_documents",
)
retriever = vectorstore.as_retriever()


from langchain_ollama import ChatOllama
llm = ChatOllama(
    model="gemma:2b",
    # model="mistral",
    temperature=0.5,
)


from langchain_core.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
)
from langchain.chains.history_aware_retriever import create_history_aware_retriever

contextualize_q_system_prompt = (
    "Given a chat history and the latest user question "
    "which might reference context in the chat history, "
    "formulate a standalone question which can be understood "
    "without the chat history. Do NOT answer the question, "
    "just reformulate it if needed and otherwise return it as is."
)
contextualize_q_prompt = ChatPromptTemplate(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)
history_aware_retriever = create_history_aware_retriever(
    llm, retriever, contextualize_q_prompt
)


from langchain.chains.retrieval import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

system_prompt = (
    "You are an assistant for question-answering tasks. "
    "Use the following pieces of retrieved context to answer "
    "the question. If you don't know the answer, say that you "
    "don't know. Use three sentences maximum and keep the "
    "answer concise."
    "\n\n"
    "{context}"
)
qa_prompt = ChatPromptTemplate(
    [
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)


question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

from langchain.globals import set_debug, set_verbose
set_debug(True)
set_verbose(True)

from langchain_core.messages import AIMessage, HumanMessage

chat_history = []

def process_question(question):
    ai_msg = rag_chain.invoke({"input": question, "chat_history": chat_history})
    chat_history.extend(
       [
           HumanMessage(content=question),
           AIMessage(content=ai_msg["answer"]),
       ]
    )
    return ai_msg["answer"]


from pprint import pprint
while True:
    user_input = input("Enter your question: ")
    if user_input == "exit":
        break
    else:
        pprint(process_question(user_input))
```

The output is like

```python
Enter your question: how does the emperor think about his cloth
[outputs]
(' order?\n'
 'Assistant: The emperor believes that wearing such special clothes will help '
 "him identify the capable and incapable men in his empire. He's convinced "
 'that this material will distinguish the clever from the stupid, and so he '
 'urgently orders the weavers to begin making the cloth for him.')

Enter your question: how do the emperor's people think about the emperor
[outputs]
("'s cloth?\n"
 'AI:  desire and curiosity.\n'
 "Assistant: The people in the emperor's city are intrigued and excited about "
 "the new fabric. They've heard stories about its beauty and the emperor's "
 'desire to see it firsthand. This has created a buzz in the community, and '
 'many are eager to witness the cloth for themselves.')

Enter your question: what was my first question
{'output_text': 'The question is: How does the emperor think about his cloth?\n'
                '\n'
                'The final answer is: The emperor thinks about his cloth and '
                'wants to see it appear as though it was in his pretty finery.'}
Enter your question:
```

The application retains a record of past conversations and accurately responds to inquiries regarding the initial question posed.

In case you receive the following message:

```sh
{'output_text': 'The passage does not specify how the emperor thinks about his '
                'cloth, so I cannot answer this question from the provided '
                'context.'}
```

You can run the model with `ollama`, to trigger the model.
```sh
ollama run gemma:2b
```
