+++
title = 'Defining Prompt and PromptTemplate'
date = 2024-10-28T22:29:49+08:00
draft = false
weight = 5
+++


This is the standard `PromptTemplate` designed to merge `context`, `chat_history`, and `human_input`, where the `context` is derived from the `similarity_search` results obtained from the vector store.

```py
from langchain_core.prompts import PromptTemplate
template = """You are a chatbot having a conversation with a human.

Given the following extracted parts of a long document and a question, create a final answer.

{context}

{chat_history}
Human :{human_input}
Chatbot:"""

prompt = PromptTemplate(
    input_variables=["chat_history", "human_input", "context"],
    template=template
)
```
