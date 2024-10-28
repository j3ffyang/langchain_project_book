+++
title = 'Complete Code'
date = 2024-10-28T21:33:00+08:00
draft = false
weight = 6
+++

Load pretty print library and ignore some annoying `UserWarning` message. These are **optional** steps.

```py
from pprint import pprint
from warnings import filterwarnings
filterwarnings("ignore", category=UserWarning)
```

Remember to create `reranker_sample.csv`, according to the sample provided in Appendix in this chapter. And place it in the same directory of this code.

Use `CSVLoader` to load the CSV file and include only the specified columns in the `page_content` of each Document. Note that any columns not listed under `metadata_columns` will be included in `page_content`.

```py
from langchain_community.document_loaders.csv_loader import CSVLoader
loader = CSVLoader(file_path="./reranker_sample.csv",
                   metadata_columns=["ticket_number", "date", "caller", "responder", "timestamp"])
data = loader.load()
```

Define embedding model

```py
from langchain_community.embeddings import HuggingFaceEmbeddings
embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
```

Embed the selected data into VectorStore and create the base retriever. Note that the `top_k` is set to `4` which is the default value. 4 entries mostly closed to searched string will be printed out.

```py
from langchain_community.vectorstores import FAISS
retriever = FAISS.from_documents(data, embedding).as_retriever(
    search_kwargs={"k": 4})

query = "if i forget the password, how to resolve the problem?"

## the following snippet shows the result of similarity_search
# docs = retriever.get_relevant_documents(query)
# pprint(docs)
```

Define and load LLM with GPT4All
```py
from langchain_community.llms import GPT4All
llm = GPT4All(
    model="./models/gpt4all/mistral-7b-openorca.gguf2.Q4_0.gguf",
    device='gpu',
    n_threads=8)
```

> Note: the `gguf` model should be downloaded prior to this step.

Define Contextual Compression Retriever. The `LLMChainExtractor` uses an `LLMChain` to extract from each document only the statements that are relevant to the query.

```python
from langchain.retrievers.contextual_compression import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
compressor = LLMChainExtractor.from_llm(llm)
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor, base_retriever=retriever
)
compressed_docs = compression_retriever.get_relevant_documents(query)
pprint(compressed_docs)
```

Generate chain with `compression_retriever`
```py
from langchain.chains import RetrievalQAWithSourcesChain
chain = RetrievalQAWithSourcesChain.from_chain_type(
    llm=llm, retriever=compression_retriever
    )

## the following code works too without source
# from langchain.chains import RetrievalQA
# chain = RetrievalQA.from_chain_type(llm=llm, retriever=compression_retriever)

pprint(chain.invoke(query))
```

The output looks like this:

```py
llama_new_context_with_model: max tensor size =   102.55 MB
llama.cpp: using Vulkan on NVIDIA GeForce RTX 4090 Laptop GPU
{'answer': ' If you forget your password, you can usually reset it by '
           'following the "Forgot Password" link on the login page of the '
           'website or application where the account is registered. This will '
           'typically prompt a recovery process involving entering an email '
           'address associated with the account and receiving a temporary '
           'password via email to log in and set a new permanent password.\n',
 'question': 'if i forget the password, how to resolve the problem?',
 'sources': './reranker_sample.csv'}
```
