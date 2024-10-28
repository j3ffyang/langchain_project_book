+++
title = 'Document and Debugging'
date = 2024-10-28T18:54:03+08:00
draft = false
weight = 7
+++


Understanding LangChain's API offers the following advantages:

- Facilitating application development.
- Assisting in debugging by enabling verbose mode to provide more detailed traces.

#### API Document in LangChain

LangChain provides an API that enables developers to easily interact with LLM and other computational resources or knowledge sources. This makes it easier to build applications such as question answering systems, chatbots, and intelligent agents.

I advise you to often check out the latest LangChain API reference, where you may examine incredibly thorough API logic at https://api.python.langchain.com/en/latest/ .

#### Debugging in LangChain

Debugging is an important aspect of building applications with LangChain. There are several options that you can enable debug and/ or verbose mode in code.

- The functions `set_debug(True)` and `set_verbose(True)` are utilized to activate debugging and verbose logging, respectively. They allow for logging intermediate stages of components and offering detailed outputs, aiding in the debugging process by printing detailed chains step by step.

    ```py
    from langchain.globals import set_debug, set_verbose
    set_debug(True)
    set_verbose(True)
    ```

- `CallbackHandlers` are objects that implement the `CallbackHandler` interface, which has a method for each event that can be subscribed to. The `CallbackManager` will call the appropriate method on each handler when the event is triggered. (credit: this information is from https://python.langchain.com/docs/modules/callbacks/). Here’s an example within RetrievalQA function:

    ```py
    from langchain.callbacks import StdOutCallbackHandler

    retrievalQA = RetrievalQA.from_chain_type(
        llm=llm,
        retriever = VectorStoreRetriever(vectorstore=vectorstore),
        chain_type="stuff",
        chain_type_kwargs={"prompt": PROMPT},
        callbacks=[StdOutCallbackHandler()],
    )
    ```

- Another one is `ConsoleCallbackHandler`, which is like `StdOutCallbackHandler`. Here’s an example which is very straightforward

    ```py
    # Define an LLM
    from langchain_community.llms import HuggingFaceEndpoint
    repo_id = "mistralai/Mistral-7B-Instruct-v0.2"
    llm = HuggingFaceEndpoint(
        repo_id=repo_id, max_new_tokens=250, temperature=0.5)

    # Define prompt
    from langchain.prompts import ChatPromptTemplate
    prompt = ChatPromptTemplate.from_template("tell me a joke about {topic}")

    # Load output parser for taking output of an LLM
    from langchain.schema.output_parser import StrOutputParser
    output_parser = StrOutputParser()
    chain = prompt | llm| output_parser

    # Enable callbacks for logging
    from langchain.callbacks.tracers import ConsoleCallbackHandler

    chain.invoke({"topic": "Tintin"}, config={'callbacks': [ConsoleCallbackHandler()]})
    ```


The result will showcase the output in a detailed step-by-step chain format.

The debugging features within LangChain simplify the process of pinpointing and resolving issues within your application. Mastering these tools enables you to develop more resilient and effective applications using LangChain. These tools also allow for the detailed printing of each chain step, providing a clear view of how data is processed throughout the workflow.
