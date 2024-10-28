+++
title = 'Selecting the Embedding Model'
date = 2024-10-28T22:23:54+08:00
draft = false
weight = 3
+++


We continue to utilize this embedding model. It's important to note that the dense vector space of this model has a dimensionality of `384`, which must be specified when setting up the vector database with Supabase.

```py
from langchain_community.embeddings import HuggingFaceEmbeddings
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
```

You can find the details of "dimensional dense vector space" from Hugging Face at https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2
