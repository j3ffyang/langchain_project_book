+++
title = 'Architecture and Workflow'
date = 2024-10-28T22:17:37+08:00
draft = false
weight = 1
+++

The data preparation process in this chapter is comparable to that of the previous chapter. After embedding the data chunks, we will utilize Supabase as our VectorStore. Supabase is set up with `pgvector`, which is based on PostgreSQL, an open-source SQL database. A notable feature we introduce here is the inclusion of both `chat_history` and `human_input` in the `history_aware_retriever`, enabling the history to be utilized in multi-round conversations. For the LLM operator, we continue to employ Ollama in conjunction with Google's Gemma or Mistral model.

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

rectangle rag_chain {
    rectangle history_aware_retriever {
        file retriever as retriever0
        rectangle contextualize_q_prompt {
            file contextualize_q_system_prompt
            file chat_history as chat_history0
                note right of chat_history0: MessagePlaceholder
            file human_input as human_input0

            contextualize_q_system_prompt -[hidden]-> chat_history0
            chat_history0 -[hidden]-> human_input0
        }
        database llm as llm0
        note right of retriever0: retriever = vectorstore.as_retriever()
    }

    rectangle question_answer_chain {
        rectangle create_stuff_documents_chain {
            rectangle qa_prompt {
                file system_prompt 
                file chat_history 
                note right of chat_history: MessagePlaceholder
                file human_input

                system_prompt -[hidden]- chat_history
            }
            database llm as llm1
        }
    }
}


vectorstore --> retriever0

history_aware_retriever -[hidden]-> question_answer_chain

retriever0 -[hidden]-> contextualize_q_prompt
contextualize_q_prompt -[hidden]> llm0

documents --> text_splitter
user -r-> query
query -r-> supabase
vectorstore -[hidden]l-> query
text_splitter -> embedding
embedding --> supabase
vectorstore --> rag_chain

chat_history -[hidden]d- human_input
{{< /plantuml >}}

Figure 6.1 Data Flow


### Dependencies

The code utilized in this chapter has specific dependencies. It is crucial to install these libraries prior to running the code.

```py
pip list | grep -i 'langchain\|supabase'

langchain                                0.3.7
langchain-chroma                         0.1.4
langchain-community                      0.3.5
langchain-core                           0.3.15
langchain-experimental                   0.3.3
langchain-huggingface                    0.1.2
langchain-ollama                         0.2.0
langchain-openai                         0.2.6
langchain-qdrant                         0.2.0
langchain-text-splitters                 0.3.2
supabase                                 2.10.0
```

Remember the rapid pace of development within the open-source community, which leads to frequent updates, sometimes even daily. Ensure to regularly update your packages and consult the associated documentation for the most current information.

For instance, to upgrade `langchain` related packages

```sh
pip install --upgrade `pip list | grep langchain | awk '{print $1}'`
```
