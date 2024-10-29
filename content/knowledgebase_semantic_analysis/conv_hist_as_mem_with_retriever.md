+++
title = 'Conversation History as a Memory with Retriever'
date = 2024-10-28T22:33:54+08:00
draft = false
weight = 7
+++


This segment highlights the innovative feature of utilizing `ConversationBufferMemory`. This component merges `human_input` and `chat_history` into a unified `memory`, which is part of the `load_qa_chain` process. The `prompt` incorporates `chat_history` and `context` derived from the `similarity_search` output of the `retriever`. The technical procedure is depicted in the subsequent diagram.

{{< plantuml >}}
rectangle ConversationBufferMemory {
    file chat_history
    file human_input
}


rectangle load_qa_chain {
    file llm
    file chain_type
    file memory
    rectangle prompt {
        file "chat_history" as ch
        file "human_input" as hi
        file context

        ch -[hidden]-> hi
        hi -[hidden]-> context
    }

    memory -[hidden]l- llm
    chain_type -[hidden]r- prompt
    llm -[hidden]d-> chain_type
    memory -[hidden]d-> prompt

}

rectangle retriever {
    database vectorstore
}

retriever -[hidden]l- human_input
hi -l-> vectorstore: similarity_search
retriever -r-> context

ConversationBufferMemory -d-> memory
{{< /plantuml >}}

Figure 6.4 Memory in a Chain


The following example shows how to define memory with `ConversationBufferMemory` function and place it into a variable in `load_qa_chain`.

```py
from langchain.memory import ConversationBufferMemory
memory = ConversationBufferMemory(memory_key="chat_history", input_key="human_input")

from langchain.chains.question_answering import load_qa_chain
chain = load_qa_chain(llm, chain_type="stuff", memory=memory, prompt=prompt)
```

This is the example that shows how to define `retriever` from `vectorstore` with `similarity_search`. Then print the response of `chain.invoke` out.

```python
from pprint import pprint
while True:
    user_input = input("Enter your question: ")
    if user_input == "exit":
        break
    else:
        retriever = vectorstore.similarity_search(user_input)
        pprint(chain.invoke({"input_documents": retriever, "human_input": user_input}, return_only_outputs=True))
```


It's important to be aware that each Large Language Model (LLM) has a token limit, which means the question-answering loop, with `memory` will terminate when this limit is exceeded. To address this issue, you can either opt for a larger language model that can handle more tokens or limit the loop by, for example, keeping only the last three rounds of conversations in memory.
