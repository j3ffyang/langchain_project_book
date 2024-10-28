+++
title = 'Set up your Environment'
date = 2024-10-28T20:04:51+08:00
draft = false
weight = 2
+++

In LangChain, when accessing a model from a remote platform, it is necessary to provide an API token (aka access token). For example, as demonstrated in the previous chapter using `HuggingFaceEndpoint` to utilize ` mistralai/Mistral-7B-Instruct-v0.2` model from Hugging Face platform, you will be required to generate a HuggingFace access token by following up the instruction at https://huggingface.co/docs/hub/en/security-tokens . You will be able to find your access token at https://huggingface.co/settings/tokens .

After generating the access token, you can proceed to set up and configure the token within the environment based on the following options.

#### Set the environment variable

To set the environment variable in the terminal, consider adding the following to `~/.bashrc` or a similar file. This approach ensures the access token is available for all projects within your environment. Additionally, I will provide guidance on configuring both the OpenAI API key and Hugging Face's API token.

```sh
export OPENAI_API_KEY="sk-YOUR_API_KEY"
export HUGGINGFACEHUB_API_TOKEN="hf_YOUR_API_TOKEN"
```

My preferred way for storing API token is to use environment variables. This way offers both convenience and security outside of your source code. Storing API token directly in code is not recommended due to potential security risks.

**Important note**:
> It is important to avoid exposing your any secret key to version control, as unauthorized individuals could potentially impersonate you and gain access to your resources on remote platforms.

You also have the option to store your access token in a `.env` file located within your Python code directory. The `.env` file should look like the following:

```sh
HUGGINGFACEHUB_API_TOKEN="hf_YOUR_API_TOKEN"
```
Your `HUGGINGFACEHUB_API_TOKEN` is also stored at `~/.cache/huggingface/token`, on Linux system.

#### In Jupyter notebook or Python code

Additionally, you can do this from inside the Jupyter notebook or Python code
```sh
import os
os.environ["OPENAI_API_KEY"] = "sk-YOUR_API_KEY"
os.environ["HUGGINGFACEHUB_API_TOKEN"] = "hf_YOUR_API_TOKEN"
```

Or

```py
from langchain.llms import OpenAI
llm = OpenAI(openai_api_key="OPENAI_API_KEY")
```

**Important note**
> When pushing code to Github or Gitlab, it is important to prevent sensitive information, such as API keys in `.env`, from being pushed in public. One way to do this is by setting up a `.gitignore` file.

To enhance your understanding of security measures, I suggest dedicating time to explore the following websites.

https://huggingface.co/docs/hub/security-tokens
https://platform.openai.com/docs/quickstart?context=python

### Cache setup

If you have enough computing resources and opt to execute all tasks locally, including loading the LLM and smaller embedding models, all downloaded models will be stored in the default directory on Linux, at `~/.cache/huggingface/hub/`.

The default directory can be altered either `HF_HOME` or `HF_HUB_CACHE` environment variable. Example for Python:

```py
import os
os.environ['HF_HOME'] = '/PATH/cache/'
And example for Bash on Linux:
export HF_HOME=/PATH/cache/
```

At the same time, PyTorch models like sentence-transformers will be stored in the directory `~/.cache/torch`.

Here is an example on my machine with several LLMs installed.
```sh
(gpt) [jeff@manjaro hub]$ pwd
/home/jeff/.cache/huggingface/hub
(gpt) [jeff@manjaro hub]$ ls
codellama-7b-python.Q4_0.gguf
gpt4all
models--google-bert--bert-base-chinese
models--google--flan-t5-small
models--gpt2
models--Salesforce--blip-image-captioning-large

(gpt) [jeff@manjaro hub]$ du -ksh
13G    .
```

This is the location where the embedding and LLM models are downloaded and installed locally. At times, LLM models like Mistral and Falcon can be quite large, with each potentially exceeding 10GB in size. Consequently, this folder may significantly expand in size, potentially consuming a considerable amount of storage space. It is advisable to monitor the folder's space periodically to manage storage efficiently.
