+++
title = 'Architecture'
date = 2024-10-28T21:20:49+08:00
draft = false
weight = 2
+++


In this chapter, we continue to employ RAG for data retrieval from the vector database, followed by processing with the LLM. However, to enhance data retrieval efficiency, we introduce a new feature known as the Contextual Compression Retriever.

{{< plantuml >}}
actor user

package data_processing {
    agent CSVLoader
    agent embedding
}

package base_retriever {
    database vectorstore
}

package compression_retriever{
    agent ContextualCompressionRetriever
}

note right of compression_retriever:Enhance the context \nquality and accuracy\nand reduce hallucination

package augmented {
    agent prompt
    agent llm
}

CSVLoader -> embedding
embedding --> vectorstore:insert selected data\ninto vectordb
embedding --> vectorstore:embed user's query
user -> embedding: query

vectorstore --> ContextualCompressionRetriever:context from `retriever.get_relevant_documents`
ContextualCompressionRetriever --> prompt:compression_retriever.get_relevant_documents(query)
prompt -> llm
{{< /plantuml >}}
Figure 4.2 RAG with Contextual Compression Retriever


The diagram illustrates that the Contextual Compression Retriever is situated between the Base Retriever and the LLM, serving as an enhancement component. We will delve into the rationale behind this arrangement later in this chapter.
