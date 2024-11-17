+++
title = 'Configuring LLM with Google Gemma'
date = 2024-10-28T22:31:49+08:00
draft = false
weight = 6
+++


Gemma is a collection of lightweight, open-source generative AI models, primarily designed for developers and researchers. Developed by Google DeepMind, the same team behind the closed-source Gemini, Gemma is engineered to be compatible with a wide array of developer tools and Google Cloud services. The name Gemma is inspired from the Latin term for precious stone, underscoring its high value within the AI development community.

The model we're utilizing has a limitation: it is quantized, which reduces accuracy to enhance performance and maintain a compact size suitable for local execution, especially when there's insufficient capacity. Therefore, it's important to remember that the quantized language model will have a compromised quality to balance performance.


```py
from langchain_ollama import ChatOllama
llm = ChatOllama(
    model="mistral",
    temperature=0.5,
)
```

If you haven't set up Ollama yet, you can refer to the "Book Summarization" chapter for guidance. However, I've outlined several straightforward steps for quick reference:

- Follow the instructions provided at https://ollama.com
- To start the Ollama server, on Linux, execute `systemctl start ollama`, and on macOS, navigate to Finder > Applications > Ollama.
- Execute `ollama pull gemma:2b` to download the model.
