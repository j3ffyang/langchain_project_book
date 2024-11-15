+++
title = 'LLM with GPT4All'
date = 2024-10-28T21:23:00+08:00
draft = false
weight = 3
+++

This time, we're leveraging Mistral in GGUF format, which is compatible with CPU execution. The model is packaged by GPT4All. From GPT4All official website, it says that GPT4All is:
> A free-to-use, locally running, privacy-aware chatbot. No GPU or internet required.

It's open-source as well. To understand GPT4All better, you can get more information from https://gpt4all.io. We just download the model from GPT4All and utilize it with LangChain. The model can be downloaded onto anywhere on your computer and it's operating system independent.

Before we dive into GPT4All, we'd need to understand GGUF.

> GGUF (GPT-Generated Unified Format), introduced as a successor to GGML (GPT-Generated Model Language), was released on August 21, 2023. This format represents a significant advancement in the field of language model file formats, enabling enhanced storage and processing of large language models like GPT. Developed by contributors from the AI community, including Georgi Gerganov, the creator of GGML, the creation of GGUF aligns with the needs of large-scale AI models, though it appears to be an independent effort. Its use in contexts involving Facebook's (Meta's) LLaMA (Large Language Model Meta AI) models underscores its importance in the AI landscape.

For more information about GGUF, you may check at https://deci.ai/blog/ggml-vs-gguf-comparing-formats-amp-top-5-methods-for-running-gguf-files/


#### Install GPT4All in the Environment
```sh
pip install gpt4all
```

<!-- #### Download the model
```sh
mkdir models    # anywhere on your computer
wget https://gpt4all.io/models/gguf/mistral-7b-openorca.Q4_0.gguf -O models/mistral-7b-openorca.Q4_0.gguf
``` -->

<!-- #### Define the LLM with LangChain

```py
from langchain_community.llms import GPT4All
llm = GPT4All(
    model="./models/mistral-7b-openorca.Q4_0.gguf",
    device='gpu',
    n_threads=8)
```

You can also customize the generation parameters, such as `n_predict`, `temp`, `top_p`, `top_k`, and others. -->

#### Download the Model

Visit https://github.com/nomic-ai/gpt4all and find the model with your interest. Or just directly download

```sh
mkdir models
wget https://gpt4all.io/models/gguf/mistral-7b-openorca.Q4_0.gguf -O models/mistral-7b-openorca.Q4_0.gguf
```


#### Define and Call the Quantized LLM

```python
from langchain_community.llms import GPT4All
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

# There are many CallbackHandlers supported, such as
# from langchain.callbacks.streamlit import StreamlitCallbackHandler

callbacks = [StreamingStdOutCallbackHandler()]
llm = GPT4All(model="./models/mistral-7b-openorca.gguf2.Q4_0.gguf", n_threads=8)

# Generate text. Tokens are streamed through the callback manager.
llm("Once upon a time, ", callbacks=callbacks)
```

<!-- ```py
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
callbacks = [StreamingStdOutCallbackHandler()]
``` -->

From the provided example, we can see that:

- The Mistral language model is managed by GPT4All.
- We utilize LangChain in conjunction with the GPT4All library to manage the language model, which appears straightforward, akin to the simplicity of Ollama as introduced in the previous chapter.

GPT4All also offers a range of other significant LLMs, which can be discovered and downloaded from its official website.

> Reminder: The Large Language Models (LLMs) included with GPT4All and Ollama are quantized, which implies that the model size has been reduced at the expense of performance. For businesses that prioritize quality, it is advisable to opt for non-quantized LLMs, such as `mistralai/Mistral-7B-Instruct-v0.2` at https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2

I will continue to use Ollama and GPT4All for managing the LLM as it is both simple and straightforward for development purposes. Meanwhile, I will provide sample code to run a non-quantized LLM. Obviously, the non-quantized LLM requires a certain amount of capacity in the environment.

#### Run the Full Model (non-quantized) Locally without GPT4All

If you do have enough capacity, you can try this code snippet to define your own LLM which is running locally, using `huggingface_pipeline`

```py
from langchain_community.llms.huggingface_pipeline import HuggingFacePipeline
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

model_id = "mistralai/Mistral-7B-Instruct-v0.2"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)
pipe = pipeline("text-generation", model=model, tokenizer=tokenizer, max_new_tokens=10)
llm = HuggingFacePipeline(pipeline=pipe)
```

> Reference > https://python.langchain.com/docs/integrations/llms/huggingface_pipelines/

#### Leverage the LLM Remotely

If you do not have an environment with enough capacity, you can simply leverage free API on Hugging Face, with `HuggingFaceEndpoint` class. In this case, nothing is downloaded locally.

```python
from langchain_community.llms import HuggingFaceEndpoint
repo_id = "mistralai/Mistral-7B-Instruct-v0.2"
llm = HuggingFaceEndpoint(repo_id=repo_id, max_new_tokens=1024, temperature=0.5)
```
