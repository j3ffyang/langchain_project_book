+++
title = 'Enable Multi-Round Conversations with Chat History'
date = 2024-10-28T22:33:54+08:00
draft = false
weight = 7
+++

In this scenario, we're implementing a system that facilitates multiple-round conversations while maintaining context throughout the interaction. To achieve this, we'll utilize LangChain's built-in chain constructors: `create_stuff_documents_chain` and `create_retrieval_chain`.

The core logic involves adding the chat history as an input, creating a history-aware retriever, and combining these elements into a robust question-answering pipeline. Let's break down the process:

#### Contextualizing the Question

We start by defining a sub-chain that processes historical messages and the latest user question. This sub-chain reformulates the question if it references any information from the chat history. We use a `MessagesPlaceholder` variable named `chat_history` to insert the conversation history into the prompt.

Key components:

- `create_history_aware_retriever`: A helper function that manages cases where chat history is empty or applies the prompt-LLM-retriever sequence.
- `contextualize_q_system_prompt`: A standard system prompt.
- `contextualize_q_prompt`: A custom prompt template that includes the system message, chat history placeholder, and user input.

Example implementation:

```py
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
```

#### Building the QA Chain

We then construct our full QA chain by updating the retriever to use the `history_aware_retriever`. This step is crucial for incorporating context from previous conversations into the current query.

Key components:

- `create_stuff_documents_chain`: Generates a question-answer chain that accepts input keys `context`, `chat_history`, and `input`.
- `create_retrieval_chain`: Applies the history_aware_retriever and `question_answer_chain` in sequence, retaining intermediate outputs like retrieved context.

Example implementation:

```py
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
```

#### Enabling Debug Mode (optional)

This configuration will generate detailed debug messages to assist in identifying any errors that may occur.

```py
from langchain.globals import set_debug, set_verbose
set_debug(True)
set_verbose(True)
```

#### Managing Chat History

To maintain the conversation state across multiple turns, we need to manage the chat history. Here's an example of how to implement this:

```py
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



<!-- 
This segment highlights the innovative feature of utilizing `ConversationBufferMemory`. This component merges `human_input` and `chat_history` into a unified `memory`, which is part of the `load_qa_chain` process. The `prompt` incorporates `chat_history` and `context` derived from the `similarity_search` output of the `retriever`. The technical procedure is depicted in the subsequent diagram.

{{< plantuml >}}
rectangle ConversationBufferMemory {
    file chat_history
    file human_input
}


rectangle load_qa_chain {
    file llm
    file chain_type
    file memory
    rectangle prompt {
        file "chat_history" as ch
        file "human_input" as hi
        file context

        ch -[hidden]-> hi
        hi -[hidden]-> context
    }

    memory -[hidden]l- llm
    chain_type -[hidden]r- prompt
    llm -[hidden]d-> chain_type
    memory -[hidden]d-> prompt

}

rectangle retriever {
    database vectorstore
}

retriever -[hidden]l- human_input
hi -l-> vectorstore: similarity_search
retriever -r-> context

ConversationBufferMemory -d-> memory
{{< /plantuml >}}

Figure 6.4 Memory in a Chain


The following example shows how to define memory with `ConversationBufferMemory` function and place it into a variable in `load_qa_chain`.

```py
from langchain.memory import ConversationBufferMemory
memory = ConversationBufferMemory(memory_key="chat_history", input_key="human_input")

from langchain.chains.question_answering import load_qa_chain
chain = load_qa_chain(llm, chain_type="stuff", memory=memory, prompt=prompt)
```

This is the example that shows how to define `retriever` from `vectorstore` with `similarity_search`. Then print the response of `chain.invoke` out.

```python
from pprint import pprint
while True:
    user_input = input("Enter your question: ")
    if user_input == "exit":
        break
    else:
        retriever = vectorstore.similarity_search(user_input)
        pprint(chain.invoke({"input_documents": retriever, "human_input": user_input}, return_only_outputs=True))
```


It's important to be aware that each Large Language Model (LLM) has a token limit, which means the question-answering loop, with `memory` will terminate when this limit is exceeded. To address this issue, you can either opt for a larger language model that can handle more tokens or limit the loop by, for example, keeping only the last three rounds of conversations in memory. -->
