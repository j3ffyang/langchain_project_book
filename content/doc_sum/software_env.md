+++
title = 'Software Environment'
date = 2024-10-28T20:58:01+08:00
draft = false
weight = 2
+++

#### Python

As LangChain, introduced in this book, is based on Python, the following is the requirements file containing the necessary libraries and modules for LangChain installation.

In my development environment, I have the following libraries installed:

> Reminder: The community is evolving, and the library is adapting rapidly. The information presented here may change over time. This list serves as a reference for the current chapter being written.

```py
beautifulsoup4                           4.12.3
faiss-cpu                                1.9.0
huggingface-hub                          0.26.2
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
numpy                                    1.26.4
pypdf                                    5.1.0
requests                                 2.32.3
requests-oauthlib                        2.0.0
requests-toolbelt                        1.0.0
sentence-transformers                    3.2.1
torch                                    2.5.1
transformers                             4.46.2
```


#### Architecture

Let's observe the architectural overview:

- LangChain oversees the LLM and VectorStore components.
- Ollama, serving as the manager for LLM, operates as a server process within the operating system, such as through `systemd` on Linux.
- VectorStore, exemplified by Qdrant in this context and overseen by LangChain, runs on Docker with a dedicated volume for persistent data storage.


{{< plantuml >}}
package langchain {
  component llm
  component vectorstore
}

package operating-system {
  component docker
  component ollama
  database storage
}

vectorstore -- docker
docker - storage
llm -- ollama
{{< /plantuml >}}

Figure 4.1 Software Architecture

#### Docker

To store embedded data in the vector database (VectorStore), I will provide guidance on configuring VectorStore in Docker for persistent data storage. Having a vector database in Docker offers the advantage of operating the database independently, allowing it to function as a server accessible to multiple clients. This approach facilitates a smooth transition from Docker to a Kubernetes container environment, ensuring consistent service delivery with system monitoring in a production setting.

By the way, having Docker is not mandatory for a vector database. Other options are to run vector database directly on the file system and in memory. The in-memory VectorStore is specifically designed for LangChain application development, as data stored this way is lost upon machine reboot.

#### Ollama

There are several ways to manage the embedding models and large language models (LLM). I want to introduce Ollama, it's surprisingly simple and straightforward.

From Ollama official documentation, it says:
> Ollama is an open-source app that lets you run, create, and share large language models locally with a command-line interface. Learn why running LLMs locally is a game changer, what models Ollama supports, and how to get started with it.

Its Command Line Interface (CLI) functions similarly to commands like `ollama pull llama2`, similar to Git and Docker. The server process can be managed using `systemd` on a Linux system for operational use in production. This server can consistently deliver LLM services without the need to reload the extensive model into memory each time LangChain is invoked.

You can install Ollama by following the instruction from https://github.com/ollama/ollama. On Linux, you can manage it by the following commands

```sh
systemctl status  ollama
systemctl restart ollama
```

Pull (download) and run the models, for example:
```sh
ollama pull mistral
ollama pull llama3
ollama run  gemma:2b
```

Refer to the official documentation for further details.

An important reminder is that the model pulled by Ollama will be stored in `/usr/share/ollama`. It is advisable to regularly monitor the disk space usage in this directory.
