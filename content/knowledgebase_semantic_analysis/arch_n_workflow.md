+++
title = 'Architecture and Workflow'
date = 2024-10-28T22:17:37+08:00
draft = false
weight = 1
+++

The data preparation process in this chapter is comparable to that of the previous chapter. After embedding the data chunks, we will utilize Supabase as our VectorStore. Supabase is set up with `pgvector`, which is based on PostgreSQL, an open-source SQL database. A notable feature we introduce here is the inclusion of both `chat_history` and `human_input` in the `ConversationBufferMemory`, enabling the history to be utilized in multi-round conversations. For the LLM operator, we continue to employ Ollama in conjunction with Google's Gemma model.

The architecture is highly modular, allowing each module to be interchangeable. This modularity is how LangChain integrates all components seamlessly.

{{< plantuml >}}
actor user
file query

rectangle data_preparation {
    rectangle document_loaders {
        file text_splitter
        file embedding
    }
    file documents
}

rectangle vectorstore {
    database supabase
    note right of supabase: pgVector
}

rectangle load_qa_chain {
    rectangle ConversationBufferMemory {
        file chat_history
        file human_input
        }

    note bottom of ConversationBufferMemory: including chat_history\nwithin the conversation

    rectangle llm {
        file ollama
    }
    note bottom of llm: switchable to other\nLLMs simply with Ollama

    rectangle prompt {
        file template
    }
}

documents --> text_splitter
user -r-> query
query -r-> supabase
vectorstore -[hidden]l-> query
text_splitter -> embedding
embedding --> supabase
vectorstore --> load_qa_chain

chat_history -[hidden]d- human_input
{{< /plantuml >}}
Figure 5.1 Data Flow


### Dependencies

The code utilized in this chapter has specific dependencies. It is crucial to install these libraries prior to running the code.

```py
pip list | grep -i 'langchain\|supabase'

langchain                                0.3.4
langchain-chroma                         0.1.2
langchain-community                      0.2.1
langchain-core                           0.3.13
langchain-experimental                   0.0.59
langchain-huggingface                    0.1.0
langchain-openai                         0.2.3
langchain-text-splitters                 0.3.0
supabase                                 2.9.1
```

Remember the rapid pace of development within the open-source community, which leads to frequent updates, sometimes even daily. Ensure to regularly update your packages and consult the associated documentation for the most current information.

For instance, to upgrade `langchain` related packages

```py
pip install --upgrade `pip list | grep langchain | awk '{print $1}'`
```
