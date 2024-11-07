+++
title = 'Install LangChain'
date = 2024-10-28T19:04:28+08:00
draft = false
weight = 1
+++

### Install LangChain

To install LangChain, you can use `pip` or `conda`.

- To install using pip, run the command
`pip install langchain`
- To install using conda, run the command
`conda install langchain -c conda-forge`

It's always recommended to check the latest version of `LangChain` at https://github.com/langchain-ai/langchain

> Reminder: The community is evolving, and the library is adapting rapidly. The information presented here may change over time. This list serves as a reference for the current chapter being written.

```py
pip list | grep langchain
langchain                                0.3.7
langchain-chroma                         0.1.4
langchain-community                      0.3.5
langchain-core                           0.3.15
langchain-experimental                   0.3.3
langchain-huggingface                    0.1.2
langchain-openai                         0.2.6
langchain-text-splitters                 0.3.2
```

### Install the required Python packages associated with your chosen LLM providers

As we intend to utilize open-source language models from Hugging Face platform within LangChain, it is necessary to configure Hugging Face accordingly. Execute the following command:

```sh
pip install huggingface-hub
```

In my development environment, I use the following main libraries to work on models. By the way, I attach a `requirements.txt` at the end of this chapter for reference.

```py
pip list | grep -i 'faiss\|huggingface\|langchain\|transformers\|openai\|qdrant\|tensor\|torch\|tokenizers\|tiktoken'

faiss-cpu                                1.9.0
huggingface-hub                          0.26.2
langchain                                0.3.7
langchain-chroma                         0.1.4
langchain-community                      0.3.5
langchain-core                           0.3.15
langchain-experimental                   0.3.3
langchain-huggingface                    0.1.2
langchain-openai                         0.2.6
langchain-qdrant                         0.2.0
langchain-text-splitters                 0.3.2
openai                                   1.54.3
qdrant-client                            1.12.1
safetensors                              0.4.5
sentence-transformers                    3.2.1
tiktoken                                 0.8.0
tokenizers                               0.20.3
torch                                    2.5.1
transformers                             4.46.2
```
