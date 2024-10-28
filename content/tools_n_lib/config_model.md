+++
title = 'Configure Models'
date = 2024-10-28T20:42:25+08:00
draft = false
weight = 4
+++

In this book, we emphasize the use of open-source LLMs over closed-source alternatives for their benefits such as freedom, flexibility, vendor unlock, and code reusability. Personally, I advocate for and actively contribute to the open-source community. Various platforms like Hugging Face, Cohere, GPT4All, etc., offer broad repositories of open-source LLMs.

Choosing LangChain with open-source models from Hugging Face via Hugging Face APIs provides flexibility. Alternatively, one can directly orchestrate LLMs and their chains without relying on Hugging Face. Both approaches will be covered in the upcoming chapters.

#### Use `repo_id` online of Hugging Face

You have the option to establish a direct connection to the model through Hugging Face. This allows you to leverage the computational power of loading LLMs from a remote platform when local computing resources are limited. It also serves as a convenient starting point for beginners with a straightforward solution.

```py
import os
# os.environ['HUGGINGFACEHUB_API_TOKEN'] = 'HF_API_KEY'
HUGGINGFACEHUB_API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")

from langchain.prompts import PromptTemplate
template = """Question: {question}
Answer: """

prompt = PromptTemplate(template=template,
input_variables=['question'])

# user question
question = "Which NFL team won the Super Bowl in the 2010 season?"

from langchain_community.llms import HuggingFaceEndpoint
from langchain.chains import LLMChain
# initialize Hub LLM
# repo_id = "google/flan-t5-xxl" # flan-t5's available too
repo_id = "mistralai/Mistral-7B-Instruct-v0.2"
hub_llm = HuggingFaceEndpoint(
    repo_id=repo_id,
    temperature=0.5
)
# create prompt template > LLM chain
llm_chain = LLMChain(prompt=prompt, llm=hub_llm)

# ask the user question about NFL 2010
print(llm_chain.invoke(question))
```

In above example, we call `HuggingFaceEndpoint` class to access the `Mistral-7B-Instruct` model from Hugging Face platform directly without having to download any model when you don’t have enough capacity locally. The code also shows how to access `google/flan-t5-xxl` model.

#### Use `model` offline of Hugging Face

If data security is a priority and you aim to confine all queries and computations within a private network, aligning with enterprise security standards, or if you possess enough local computing power, like an Nvidia RTX 4090 graphic card on my Manjaro Linux, you have the option to download models, including Mistral and Falcon, directly to your local storage. Follow the following configuration steps to enable local execution of all processes.

The provided sample code demonstrates how to download an embedding model from Hugging Face for local utilization. Then embed a single line of text and print out the results with `embed_query` method.

```py
from langchain_community.embeddings import HuggingFaceEmbeddings
embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

text = "This is a test document."
query_result = embedding.embed_query(text)

print(query_result[:3])
print(type(query_result))
```

In the above case, we're using `sentence-transformers/paraphrase-multilingual-MiniLM` which is downloaded locally from Hugging Face repository.

By default, the download resides in `~/.cache/torch/sentence_transformers`.

For example:
```sh
cd ~/.cache/torch/sentence_transformers; ls
sentence-transformers_all-MiniLM-L6-v2
sentence-transformers_all-mpnet-base-v2
sentence-transformers_paraphrase-multilingual-MiniLM-L12-v2

du -ksh
983M .
```

I have 3 small embedding models, from sentence-transformers, downloaded locally, and they're total less than 1G size.
