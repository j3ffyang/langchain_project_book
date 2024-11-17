+++
title = 'Preparing Data'
date = 2024-10-28T22:21:47+08:00
draft = false
weight = 2
+++

This part is the same as our previous discussion, with text loading from internet or you can load from either PDF with `PyPDFLoader` or Microsoft Word document, with `Docx2txtLoader`, split into smaller chunks, then get ready to insert into the VectorStore.

```py
from langchain_community.document_loaders import WebBaseLoader
loader = WebBaseLoader("https://en.wikisource.org/wiki/Hans_Andersen%27s_Fairy_Tales/The_Emperor%27s_New_Clothes")
documents = loader.load()

from langchain.text_splitter import RecursiveCharacterTextSplitter
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
chunks = splitter.split_documents(documents)
```
