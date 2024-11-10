+++
title = 'Select a Right Language Model'
date = 2024-10-28T17:52:48+08:00
draft = false
weight = 2
+++

When selecting a language model and an embedding model in LangChain technology, there are several things to consider:

- **Primary Task**: Identify the core functions of the language model (LLM), which include tasks like text generation, summarization, translation, and answering queries. A valuable resource to explore these tasks is https://huggingface.co/models covering a wide range from Multimodal to Computer Vision (CV) and Natural Language Processing (NLP). Common examples in this context involve Summarization, Text Generation, and Question Answering within NLP.

- **Model Size**: The size of LLMs can vary significantly, with models ranging from millions to billions of parameters. Larger models typically offer better performance but are also more computationally expensive.

- **Pre-Trained vs. Fine-Tuned**: Fine-tuned models are designed specifically for a given task or domain, whereas pre-trained models are appropriate for a variety of tasks. Based on my practical experience, fine-tuning a custom model in a real project is not as straightforward as anticipated in theory. The objective of fine-tuning is to train a customized model using a base model like Llama2. The main challenge lies in the difficulty of curating a dataset of sufficient quality and quantity, which is not a simple work, to effectively train a domain-specific model.
One of my projects entailed training a renowned novel (the dataset comprises all content of the novel and numerous comments carefully chosen for their guaranteed quality) using multiple base models, notably llama2. We dedicated four weeks to curate up to 10,000 question-answer pairs (not enough obviously) before inputting them into the base model for training. Due to the novel-specific nature of these QA pairs, ensuring their accuracy and quality through thorough review proved to be quite time-consuming with a certain level of knowledge required. Unfortunately, the model's performance post-training fell short of expectations, likely due to our supplied data being buried within the generic framework of the base model, which is typically tailored for broader applications rather than domain-specific tasks. Instead of fine-tuning your own model, I would suggest considering retrieval augmented generation (RAG) due to its advantages in query quality, performance, and task flexibility.

- **Accuracy**: The model you select should have excellent performance and accuracy.
Within this book, I have endeavored to explore and evaluate about 10 distinct open-source language models using LangChain, drawing from my personal experiences across various projects. This approach aims to provide firsthand experience to Language Learning Models (LLMs), encompassing models like Mistral, Llama2, Gemma, Flan, and GPT-2. I will systematically delve into each model with accompanying code examples for a comprehensive understanding.

- **Integration**: To facilitate the integration of the model into your current systems, search for an LLM provider that provides user-friendly APIs or SDKs. As an illustration, consider Google's `Gemma` model, which was unveiled in early 2024. To explore its integration with Transformers, you can refer to https://huggingface.co/google/gemma-7b?library=true . This resource demonstrates the straightforward process of integrating Gemma into a Python library.

- **Scalability**: The model you select should be able to handle the amount of data you intend to process, especially if you require large-scale real-time responses.

- **Cost**: Understand the pricing model, which could be influenced by factors like token quantity, API usage, or computational hours, as seen in platforms like OpenAI. In this book, the language models employed in this guide will be entirely open source. This means they are technically free to utilize, offering an alternative to services like OpenAI.

- **Storage**: In terms of storage, options like ElasticSearch, FAISS, or Qdrant can be used based on your specific requirements. FAISS, for example, is fast due to its GPU support but requires you to maintain your metadata information separately in some database with mapping of your FAISS ids. For long documents, it's useful to split the document into multiple sections if your transformer model has a context length limit (such as 512 tokens), and each section corresponds to its own vector.

Again, I will explore the open-source language models featured in this guide, accessible at https://huggingface.co

In conclusion, the precise tasks you need to complete, the model's size, its accuracy, ease of integration, scalability, cost, and the kind of semantic search you're using will all influence your choice of LLM. It's worthwhile to regularly visit https://huggingface.co/models to explore its playground and select a model that fits your real-world situation. 

### Some Models with My Experience

I have been a part of various genuine customer interactions where we delved into discussions regarding the design conversation flow and business situations. The LangChain framework serves as the backbone for crafting project designs, and I'm eager to impart some insights I have gained from these experiences. These lessons, drawn from real-world projects, offer valuable perspectives, such as collecting raw data, choosing appropriate LLMs, customizing prompt(s) and establishing a precise chain to handle communication.

- **Mistral 7B** stands as a cutting-edge 7.3 billion parameter language model, marking a significant leap in the realm of large language models (LLMs). It has surpassed the performance of the 13 billion parameter Llama 2 model across all tasks and excels over the 34 billion parameter Llama 1 on numerous benchmarks.
Undoubtedly, this model ranks among the top-tier open-source LLMs I have utilized in LangChain development projects, offering impressive performance while demanding reasonable computational resources (such as a GPU with 16GB memory like an NVIDIA RTX 4090). Its strengths lie in performance, orchestration flexibility, accuracy, competitiveness, and comparison with services like OpenAI. This book primarily showcases code examples focused on the Mistral LLM, conveniently packaged by GPT4All and Ollama for easy use. I love this model.

- **FLAN-T5** is a publicly available, extensive language model designed for sequence-to-sequence tasks, suitable for commercial applications. Developed by Google researchers towards the end of 2022, this model has undergone fine-tuning across diverse tasks. The T5 model restructures different tasks into a text-to-text framework, encompassing activities like translation, linguistic evaluation, sentence comparison, and document condensation. FLAN represents "Fine-tuned LAnguage Net," while T-5 stands for "Text-To-Text Transfer Transformer."

- **Llama2**: Llama-2 is free to download, but Meta requires a register to grant us access to this model's family with additional commercial terms. The request is made through a Meta Webpage, which can be accessed from the model homepage on Hugging Face. You can use it as the base to train your own model with fine-tuning.

- **GPT-2**: The GPT-2 model, a formidable transformer-based language model with 1.5 billion parameters, was trained using a dataset of 8 million web pages. Its primary training goal is to predict the next word by considering all preceding words in a text. The diverse nature of the dataset ensures that this fundamental objective covers genuine instances of numerous tasks across various fields. GPT-2 stands as a notable improvement over its forerunner, GPT, with more than ten times the parameters and trained on over ten times the data volume.

- **MiniLM**: You can find the details by searching `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` or `sentence-transformers/all-mpnet-base-v2` at https://huggingface.co/sentence-transformers . It can be used for tasks like clustering embedding or semantic similarity search. Throughout this guide, we will utilize these models for embedding with the VectorStore.

- **Gemma**: a series of cutting-edge open models, is derived from Gemini's technology. With options of 2 billion and 7 billion parameters, Gemma demonstrates superior performance in language tasks and safety assessments, outperforming competitors in 11 out of 18 text-based tasks. The project prioritizes responsible deployment of LLMs to improve safety and drive innovation. Gemma's lightweight design and open-source approach position it as a significant advancement in LLMs. We’re going to use `gemma-2b` model in next chapters. The model can be found at https://huggingface.co/google/gemma-2b

- **`t5-base-finetuned-wikiSQL`**: I found this one intriguing from Hugging Face and used this model to generate translate user’s instruction in text into SQL. Here’s  and give a snippet of code as example: (To run the Python code provided, it is crucial to prepare a functional environment, a process that will be elaborated on in the subsequent chapter. You may find it beneficial to proceed directly to that chapter to set up the necessary environment for running the code.)

    ```py
    from pprint import pprint

    from langchain_community.llms import HuggingFaceHub
    llm = HuggingFaceHub(repo_id="mrm8488/t5-base-finetuned-wikiSQL")
    
    from langchain.prompts import PromptTemplate
    prompt = PromptTemplate(
        input_variables=["question"],
        template="Translate English to SQL: {question}"
    )
    
    from langchain_core.runnables import RunnableLambda
    chain = prompt | llm
    
    pprint(chain.invoke("What is the average age of the respondents using a mobile device?"))
    pprint(chain.invoke("What is the median  age of the respondents using a mobile device?"))
    ```

    The output shows a SQL generated from `t5-base-finetuned-wikiSQL` model, which is fine-tuned from Google’s T5

    ```sh
    > Entering new LLMChain chain...
    Prompt after formatting:
    Translate English to SQL: What is the median  age of the respondents using a mobile device?

    > Finished chain.
    {'question': 'What is the median  age of the respondents using a mobile '
                 'device?',
    'text': 'SELECT Median age (years) FROM table WHERE Device = mobile'}
    ```

After reviewing a variety of language models from numerous open-source repositories, let's delve into understanding how to configure the typical and widely used settings of these models.

