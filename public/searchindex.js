var relearn_searchindex = [
  {
    "breadcrumb": "LangChain Project Handbook \u003e LangChain Fundamentals",
    "content": "The architectural components of LangChain, illustrated in Figure 1.1, will be thoroughly explored and discussed in detail throughout the book.\npackage LangChain { package Agent_Tooling { agent Tools agent Toolkits } package Models_IO { agent Model agent Prompt agent Output_Parser } package Chain_and_Retrieval { agent Retriever agent Document_Loaders agent VectorStore agent TextSplitter agent Embedding_Model } } Chain_and_Retrieval -[hidden] Models_IO Models_IO -[hidden] Agent_Tooling Model -[hidden]- Prompt Prompt -[hidden]- Output_Parser Retriever -[hidden] Document_Loaders Document_Loaders -[hidden]- VectorStore VectorStore -[hidden] TextSplitter Document_Loaders -[hidden]- VectorStore TextSplitter -[hidden]- Embedding_Model Tools -[hidden]- Toolkits Model: also known as LLM model serve as the core elements of LangChain. They essentially act as wrappers for these models, enabling the utilization of their specific functionalities and capabilities. Chain: Chain enables us to integrate multiple components to address a specific task. It streamlines the process of implementing complex applications by enhancing modularity, making debugging and maintenance more straightforward. Document loaders: Document Loaders play a role in loading documents into the LangChain system, managing a range of document types like PDFs, and transforming them into a compatible format for LangChain processing. This procedure encompasses multiple stages, including data ingestion, context comprehension, and refinement. Prompt: Prompts serve as inputs for LLMs to generate specific responses. Crafting effective prompts is vital for obtaining valuable outputs from LLMs. Prompt engineering aims to create prompts that yield precise, relevant, and beneficial responses from LLMs. For instance, the prompt plays an amazing role in the output when examining the prompt in OpenAI’s Sora, which creates stunning and visually striking videos. VectorStore: It brings functions for the effective storage and retrieval of vector embeddings. And it operates as a repository for vectors containing supplementary data, streamlining the processes of storage, search, and point management. Output Parsers: The output_parser converts the output of an LLM into a more appropriate format, especially beneficial when generating structured data using LLMs. Agents: LLMs can communicate with their surroundings through agents. For instance, carrying out a particular task via an external API, or grabbing extra data from outside website. LangChain utilizes a sequential pipeline method to construct tailored applications for LLM. This structured approach integrates diverse services, data inputs, and formatting processes, ensuring accurate processing and consistent output. Modules in LangChain follow a step-by-step process with single inputs and outputs, facilitating smooth data flow. This mechanism simplifies development and enhances LLM utilization. By streamlining workflows, LangChain optimizes AI application development, executing steps in a specific order to real-world processes for managed outcomes. ### LangChain Workflow\nHaving grasped the fundamental elements of LangChain, let’s observe its process in detail and how the message is handled. The actual scenarios can change the workflow’s logic depending on the requirements. A very common conversation flow is shown in Figure 1.2, which includes document_loaders, data embedding into vectorstore, and query similarity_search within RetrievalQA chain, then returns the analyzed result to the user.\nactor user component Load_Docs component Query component LLM_generates_answer package LangChain { component Document_Loaders component CharacterTextSplitter component embeddings component PromptTemplate component RetrievalQA } Load_Docs -\u003e Document_Loaders user -\u003e Query Query -\u003e RetrievalQA Document_Loaders -\u003e CharacterTextSplitter CharacterTextSplitter --\u003e embeddings PromptTemplate \u003c- embeddings PromptTemplate --\u003e RetrievalQA RetrievalQA -\u003e LLM_generates_answer Load_Docs -[hidden]- user Query -[hidden]- LLM_generates_answer Let’s discuss these steps in detail. I’ve included the Python code for a set of typical modules to demonstrate the components. The real projects will be covered in detail in the upcoming chapters. To run the Python code provided, it is required to set up a working environment, a procedure that will be elaborated on in the upcoming chapter. You can directly proceed to the next chapter to configure your development environment, ensuring the necessary libraries are installed and properly set up for the successful execution of the sample code presented here.\ndocument_loaders can load, extract data from diverse sources and transform it into structured documents. It can handle *.txt (plain text) and *.xls (Microsoft Excel), load the HTML content from any website. Here’s an example of loading data from Wikipedia through WebBaseLoader\nfrom langchain_community.document_loaders import WebBaseLoader loader = WebBaseLoader(\"https://en.wikipedia.org/wiki/Text_file\") document = loader.load() LangChain uses the TextSplitter class to break down the document into smaller chunks that can be more easily processed by the language model. One of the most used splitters, RecursiveCharacterTextSplitter, divides a large text into chunks based on a defined size, using a set of characters. By default, it utilizes characters like [\"\\n\\n\", \"\\n\", \" \"], and [\"\"]. Initially, it attempts to split the text using “\\n\\n”. If the resulting chunks are still too large, it progresses to the next character, “\\n”, for further splitting. This process continues through the set of characters until a split smaller than the specified chunk size is achieved. The chunk_size parameter controls the max size of the final documents, and the chunk_overlap parameter specifies how much overlap there should be between chunks.\nfrom langchain.text_splitter import RecursiveCharacterTextSplitter splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50) docs = splitter.split_documents(document) LangChain uses a VectorStore to create embeddings for each document split. These embeddings are numerical representations of the text that can be used for efficient information retrieval. The provided code snippet utilizes the all-mpnet-base-v2 model from HuggingFaceEmbeddings by default. If not explicitly specified, this model is used. Additionally, the code operates with a vector store based on Qdrant, running in memory. (Please be aware that the vector store we have just set up operates in memory, which implies that all data will be lost when your computer is turned off. The advantage of utilizing a memory-based vector store is the ability to swiftly test your code without the need to save it. We will delve into persistent storage for production purposes in upcoming chapters). The collection is named wikipedia in vectorstore.\nfrom langchain_community.embeddings import HuggingFaceEmbeddings from langchain_community.vectorstores import Qdrant vectorstore = Qdrant.from_documents( docs, embedding=HuggingFaceEmbeddings(), location=\":memory:\", collection_name=\"wikipedia\", ) # You can print out all parameters of Embeddings # print(HuggingFaceEmbeddings()) Subsequently, the VectorStore is employed to conduct a similarity_search on the document embeddings, aiming to identify the documents most pertinent to the user’s query. The search provides relevance scores for the query and outputs 2 results.\nquery = \"What's flatfile?\" result = vectorstore.similarity_search_with_score(query, k=2) print(result) To make foundation models useful for domain-specific tasks, the Retrieval Augmented Generation (RAG) framework augments prompts with external data from multiple sources, including document repositories, databases, or APIs. In a later chapter, we will examine how RAG functions in actual projects. For the time being, this is a brief excerpt of RAG code that illustrates how retrieval functions to obtain data from vectorstore using meaning rather than keywords.\nquery = \"What is flatfile?\" retriever = vectorstore.as_retriever() print(retriever.get_relevant_documents(query)[0]) The entire code, for instance, looks like this:\nfrom langchain_community.document_loaders import WebBaseLoader loader = WebBaseLoader(\"https://en.wikipedia.org/wiki/Text_file\") document = loader.load() from langchain.text_splitter import RecursiveCharacterTextSplitter splitter = RecursiveCharacterTextSplitter( chunk_size=1000, chunk_overlap=50 ) docs = splitter.split_documents(document) from langchain_community.embeddings import HuggingFaceEmbeddings from langchain_community.vectorstores import Qdrant vectorstore = Qdrant.from_documents( docs, embedding=HuggingFaceEmbeddings(), location=\":memory:\", collection_name=\"wikipedia\", ) # print(HuggingFaceEmbeddings()) query = \"What's flatfile?\" result = vectorstore.similarity_search_with_score(query, k=2) print(result) retriever = vectorstore.as_retriever() print(retriever.get_relevant_documents(query)[0]) The above code snippet goes through the following steps to process the document\nLoad a document, and split it into smaller chunks Insert the splitted chunks into VectoreStore, which is configured as running in memory. You may want to persist it in production Create a query, then send it to VectorStore for similarity_search Retrieve the relevant document The flow is straight forward and simple. The code in the previous example follows a fundamental flow, incorporating VectorStore with embeddings but not yet involving LLM. Our next step is to introduce an LLM into the process.",
    "description": "The architectural components of LangChain, illustrated in Figure 1.1, will be thoroughly explored and discussed in detail throughout the book.\npackage LangChain { package Agent_Tooling { agent Tools agent Toolkits } package Models_IO { agent Model agent Prompt agent Output_Parser } package Chain_and_Retrieval { agent Retriever agent Document_Loaders agent VectorStore agent TextSplitter agent Embedding_Model } } Chain_and_Retrieval -[hidden] Models_IO Models_IO -[hidden] Agent_Tooling Model -[hidden]- Prompt Prompt -[hidden]- Output_Parser Retriever -[hidden] Document_Loaders Document_Loaders -[hidden]- VectorStore VectorStore -[hidden] TextSplitter Document_Loaders -[hidden]- VectorStore TextSplitter -[hidden]- Embedding_Model Tools -[hidden]- Toolkits Model: also known as LLM model serve as the core elements of LangChain. They essentially act as wrappers for these models, enabling the utilization of their specific functionalities and capabilities. Chain: Chain enables us to integrate multiple components to address a specific task. It streamlines the process of implementing complex applications by enhancing modularity, making debugging and maintenance more straightforward. Document loaders: Document Loaders play a role in loading documents into the LangChain system, managing a range of document types like PDFs, and transforming them into a compatible format for LangChain processing. This procedure encompasses multiple stages, including data ingestion, context comprehension, and refinement. Prompt: Prompts serve as inputs for LLMs to generate specific responses. Crafting effective prompts is vital for obtaining valuable outputs from LLMs. Prompt engineering aims to create prompts that yield precise, relevant, and beneficial responses from LLMs. For instance, the prompt plays an amazing role in the output when examining the prompt in OpenAI’s Sora, which creates stunning and visually striking videos. VectorStore: It brings functions for the effective storage and retrieval of vector embeddings. And it operates as a repository for vectors containing supplementary data, streamlining the processes of storage, search, and point management. Output Parsers: The output_parser converts the output of an LLM into a more appropriate format, especially beneficial when generating structured data using LLMs. Agents: LLMs can communicate with their surroundings through agents. For instance, carrying out a particular task via an external API, or grabbing extra data from outside website. LangChain utilizes a sequential pipeline method to construct tailored applications for LLM. This structured approach integrates diverse services, data inputs, and formatting processes, ensuring accurate processing and consistent output. Modules in LangChain follow a step-by-step process with single inputs and outputs, facilitating smooth data flow. This mechanism simplifies development and enhances LLM utilization. By streamlining workflows, LangChain optimizes AI application development, executing steps in a specific order to real-world processes for managed outcomes. ### LangChain Workflow",
    "tags": [],
    "title": "LangChain Architecture",
    "uri": "/langchain_project_book/fundamentals/architecture/index.html"
  },
  {
    "breadcrumb": "LangChain Project Handbook",
    "content": "It is with great pleasure and enthusiasm that I present to you this book on the orchestration of large language models with LangChain. As an experienced Python and LangChain developer, I have had the privilege of participating in numerous projects that revolve around language modeling. These engagements have provided me with invaluable hands-on experience and insight into the complexities and challenges associated with building and managing large language models.\nThe goal of this book is to equip you, the reader, with the knowledge and skills necessary to successfully orchestrate large language models using LangChain. We will explore the intricacies of language modeling, delve into the nuances of LangChain, and provide practical guidance on how to effectively manage and optimize language models at scale. This book aims to serve as your comprehensive guide, blending theory with real-world scenarios to offer a holistic understanding of this cutting-edge technology.\nFurthermore, my passion for open-source software development has led me to contribute to the open-source community for the past two decades. With this book, I not only intend to provide valuable insights but also contribute to the rapidly expanding pool of knowledge and resources available to the open-source software community. It is my hope that by sharing my experiences and expertise, we can collectively advance the field of language modeling and empower others to build upon our work.\nFinally, I encourage you, the reader, to embark on this journey through the pages of this book with an open mind and a thirst for knowledge. I hope that the information presented here will empower you to leverage LangChain’s capabilities to orchestrate and optimize large language models, enabling you to bring your own language model projects to new heights of success.\nThank you for embarking on this adventure, and may your exploration of LangChain and large language models be rewarding and fruitful.\n“If I have seen further, it is by standing upon the shoulders of giants.\"\nApproach This book offers a comprehensive understanding of LangChain, including its core concepts, real-world use cases, and GitHub code examples. Readers will confidently orchestrate language models with LangChain for advanced natural language processing.\nShort Description Discover LangChain’s functions, design insights, and real-world applications like retrieval augmented generation. Engage with the vibrant LangChain open-source community to unlock its potential for powerful language model applications.\nLong Description In the rapidly evolving world of technology, LangChain emerges as a game-changer. In this book, you will discover LangChain’s importance in the tech world and delve into its functions for creating advanced language model applications. This book equips you with the knowledge to construct context-aware applications that enable language models to interact with their environment and other data sources. The book gives you a hands-on practice to build four applications using LangChain. Throughout the book, you will learn to enhance data processing in four project. In “Book Summarization and Q\u0026A - Project One,” LangChain facilitates the management of private data, while “Ticketing System - Project Two” streamlines customer support ticket handling through semantic analysis. “Knowledge Base Semantic Analysis - Project Three” employs LangChain for efficient similarity search and semantic analysis in a knowledge base. Lastly, “Intelligent Programming Assistant - Project Four” harnesses the power of LangChain to generate code and natural language from code and text prompts, offering support for multiple programming languages. By the end of this book, you’ll acquire the expertise to create LLM apps with LangChain, from Python setup to model integration, and become proficient in creating custom language model applications for various domains.\nIn the rapidly evolving world of technology, LangChain emerges as a game-changer. In this book, you will discover LangChain’s importance in the tech world and delve into its functions for creating advanced language model applications.\nThis book equips you with the knowledge to construct context-aware applications that enable language models to interact with their environment and other data sources. The book gives you a hands-on practice to build four applications using LangChain. For instance, in the first application, titled “Book Summarization and Q\u0026A - Project One,” we utilize LangChain to orchestrate the processing of private data in a specific domain with an open source language model.\nIn “Ticketing System - Project Two,” LangChain orchestrates the processing of customer support tickets within a private network using domain-specific data. The system automates ticket handling, streamlining customer support, and improving response times and accuracy through semantic analysis performed by a Large Language Model.\nIn “Knowledge Base Semantic Analysis - Project Three,” - a knowledge base is loaded into a vector database. LangChain provides task scheduling, data management, and fault tolerance features to orchestrate the process of similarity search. The LLM then performs semantic analysis on queries, identifying the most relevant information in the knowledge base.\nIn “Intelligent Programming Assistant - Project Four” - this LLM generates code and natural language about code, from both code and natural language prompts. It can also be used for code completion and debugging. It supports many popular programming languages including Python\nBy the end of this book, you’ll acquire the expertise to create LLM apps with LangChain, from Python setup to model integration, and become proficient in creating custom language model applications for various domains.\nWhat will you learn Begin by introducing LangChain, its history, motivations, and practical applications Dive into LangChain’s core principles, architecture, and how language models interact hierarchically Cover essential components: model training, data management, architecture, and tuning Start with LangChain setup, progress to deployment, including data prep, training, and assessment Apply LangChain to NLP, translation, chatbots, code gen, with real-world examples Explore LangChain’s future through research, projects, societal impact, for insightful contributions Audience This book is primarily targeted towards software developers, machine learning engineers, and AI researchers who wish to understand the intricacies of orchestrating large language models using LangChain. Familiarity with Python programming and basic concepts of machine learning will be beneficial, although not mandatory, as this book will guide you through the fundamentals before delving into the more advanced topics. Additionally, data scientists and language processing enthusiasts looking to leverage language models and explore cutting-edge techniques will find this book valuable.\nAuthor Bio - Jeff Jie Yang The author is an ardent expert in Linux and open-source technologies, with a career spanning two decades. Starting at IBM’s software development labs in Canada, the USA, and China, he transitioned from a software engineer to a Senior Technical Staff Member. His expertise extends to designing architectures using Kubernetes and containerized GitOps, and automation, aligning with standards from the Cloud Native Computing Foundation.\nIn recent 5 years, the author has developed a profound interest in Natural Language Processing, Machine Learning, and Python. This curiosity led him to explore the world of large language models, particularly LangChain. He’s leading a lab utilizing LangChain for several projects, reflecting his technical proficiency and dedication to innovation.",
    "description": "It is with great pleasure and enthusiasm that I present to you this book on the orchestration of large language models with LangChain. As an experienced Python and LangChain developer, I have had the privilege of participating in numerous projects that revolve around language modeling. These engagements have provided me with invaluable hands-on experience and insight into the complexities and challenges associated with building and managing large language models.\nThe goal of this book is to equip you, the reader, with the knowledge and skills necessary to successfully orchestrate large language models using LangChain. We will explore the intricacies of language modeling, delve into the nuances of LangChain, and provide practical guidance on how to effectively manage and optimize language models at scale. This book aims to serve as your comprehensive guide, blending theory with real-world scenarios to offer a holistic understanding of this cutting-edge technology.",
    "tags": [],
    "title": "Preface",
    "uri": "/langchain_project_book/preface/index.html"
  },
  {
    "breadcrumb": "LangChain Project Handbook",
    "content": "The fundamental ideas and elements of LangChain, a framework for creating language-model-powered applications, are covered in this chapter. LangChain aims to develop data-aware and agentic applications that enable language models to communicate with their surroundings and establish connections with other data sources, rather than only calling out to a language model via an API.\nAt the heart of LangChain are two key components. The first one is the modular abstractions provided by LangChain, which are essential for working with language models. These components are designed to be easy to use, whether you use the rest of the LangChain framework or not.\nThe Use-Case Specific Chains make up the second part. These might be conceptualized as putting together the required parts in a certain order to complete a certain use case. These chains are intended to serve as a more advanced interface that makes it simple for users to begin a particular use case. Additionally, they are adaptable, giving you flexibility according to the requirements of the application.\nMoreover, LangChain is context-aware, allowing applications to make decisions depending on the context that is supplied by linking a language model to context-giving sources. Because of this, LangChain is a crucial tool for creating apps that can communicate with language models and make deft choices depending on the environment.\nFrom the high level of LangChain framework, the main components include:\nArchitecture and Workflow Modules and Models Embeddings and VectorStor Chains and Retrievers Technical Requirements To grasp “LangChain Fundamentals”, you’ll need proficiency in Python, including its data science libraries, and a kind of understanding of large language models like LLaMA, Mistral and Gemma. Knowledge of data structures is essential for efficient data processing. Familiarity with machine learning and natural language processing concepts will be beneficial, given LangChain’s focus on language models. Basic understanding of APIs is required for data interactions.\nIn practical projects, deploying a large language model (LLM) as a service typically involves launching it in a Docker container, or Kubernetes. Hence, having familiarity with containers would also be advantageous.\nLangChain is an open-source tool with a Python and JavaScript codebase. However, the examples provided in this guide exclusively focus on Python. ### What is LangChain?\nImagine a scenario where you have many business reports and you’re scheduled to have a business meeting with your higher management next Monday. However, you have yet to create a summary of these reports. Wouldn’t it be convenient if you could simply ask your text reports to highlight the key points you need to discuss? LangChain is designed to make this task a reality.\nLangChain is an open-source framework designed to help build applications powered by LLMs, like ChatGPT, and create more advanced use cases around LLMs by chaining together different components from several modules.\nLet’s look at some of the features of LangChain:\nIt is an innovative technology that aims to bridge the gap between languages and facilitate communication on a global scale. It leverages artificial intelligence (AI), machine learning (ML), and natural language processing (NLP) to enable real-time translation and interpretation services, not only human languages, but also programming languages. It can be used to develop intelligent applications, such as chatbots, semantic optimization, text generation and summarization, and programming language translation. It offers endless possibilities for creating powerful applications that harness the capabilities of LLMs. It is an open-source framework that streamlines the development of applications utilizing large language models like OpenAI or Hugging Face. It offers end-to-end chains integration to facilitate working with various programming languages, platforms, and data sources. By leveraging these features, developers can create powerful and innovative applications that leverage the power of language models.\nLangChain is not without its challenges, and there are concerns regarding privacy, accuracy, and potential biases in LangChain. We’ll discuss this later in the book.\nWhat Problem does LangChain Resolve? The goal of LangChain is to address the different issues that arise while developing applications with LLMs. Important problems that LangChain aims to solve include:\nStandardizing prompt structures: By making the prompt structure simpler, LangChain helps developers who collaborate with LLMs to work more efficiently. Innovative open-source projects like Lepton and AutoPrompt, accessible on GitHub, focus to standardize prompt structure metadata to address the issue of Language Models struggling to comprehend prompts. Strengthening integration capabilities: LangChain guarantees the smooth application of LLM outputs among various modules and libraries. Simplifying model switching: With LangChain, developers may quickly move between different LLM models, as well as embedding models for VectorStore, in their applications. I am particularly fond of Quivr, a concept known as the “second brain”, which streamlines prompt editing, facilitates model transitions, connects the front-end with the back-end, and supports ongoing conversations while ensuring user access authentication. Similar services can be discovered on platforms such as Phind.com, Perplexity.ai, and Poe.com, among others. Effective memory management: LangChain helps maintain memory records, e.g. follow-up conversation, as needed while developing applications. Optimizing data handling: LangChain improves overall efficiency by streamlining data management in LLM-driven systems. With its framework, LangChain improves the development process with LLMs by providing tools and features that are tailored to address the typical obstacles that developers face while working with AI and data engineering.",
    "description": "The fundamental ideas and elements of LangChain, a framework for creating language-model-powered applications, are covered in this chapter. LangChain aims to develop data-aware and agentic applications that enable language models to communicate with their surroundings and establish connections with other data sources, rather than only calling out to a language model via an API.\nAt the heart of LangChain are two key components. The first one is the modular abstractions provided by LangChain, which are essential for working with language models. These components are designed to be easy to use, whether you use the rest of the LangChain framework or not.",
    "tags": [],
    "title": "LangChain Fundamentals",
    "uri": "/langchain_project_book/fundamentals/index.html"
  },
  {
    "breadcrumb": "",
    "content": "Introduction My Journey with LangChain In late 2022, I embarked on an exciting journey with LangChain while leading a development team. This coincided with OpenAI’s significant boost in popularity, marking a pivotal moment in AI technology.\nDiscovery and Adoption After several months of exploration, our team identified LangChain as the ideal API standard and base platform for our projects. What drew us to LangChain was its comprehensive suite of features:\nConfiguring vector databases Orchestrating multiple popular embeddings and large language models from open source community Facilitating complex workflows with agents These capabilities made LangChain an indispensable tool for our development needs.\nWriting Experience During this period, I received an invitation from a renowned UK publisher to author a book about LangChain design and project implementation. Leveraging my hands-on experience, I dedicated nearly six months to crafting this comprehensive guide.\nUnfortunately, despite the effort invested, the book project was ultimately terminated. The reasons cited were a lack of a clear value proposition and insufficient trust in the communication process.\nOpen-Source Initiative Undeterred by this setback, I decided to take a different approach. Recognizing the potential benefits of sharing knowledge within the developer community, I chose to publish my work as open-source material.\nThis decision aligns with the spirit of collaborative innovation that drives many successful tech projects. By making my experiences and insights freely available, I hope to contribute meaningfully to the LangChain ecosystem and support fellow developers in their own journeys.\nCall to Action I invite you to explore these resources and share your thoughts. Your feedback and comments are invaluable in refining and expanding this body of knowledge. Together, we can create a richer understanding of LangChain and its applications.\nFeel free to engage in discussions, ask questions, or suggest improvements. Let’s foster a vibrant community around LangChain and push the boundaries of what’s possible with this powerful tool!",
    "description": "Introduction My Journey with LangChain In late 2022, I embarked on an exciting journey with LangChain while leading a development team. This coincided with OpenAI’s significant boost in popularity, marking a pivotal moment in AI technology.\nDiscovery and Adoption After several months of exploration, our team identified LangChain as the ideal API standard and base platform for our projects. What drew us to LangChain was its comprehensive suite of features:",
    "tags": [],
    "title": "LangChain Project Handbook",
    "uri": "/langchain_project_book/index.html"
  },
  {
    "breadcrumb": "LangChain Project Handbook",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Categories",
    "uri": "/langchain_project_book/categories/index.html"
  },
  {
    "breadcrumb": "LangChain Project Handbook",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tags",
    "uri": "/langchain_project_book/tags/index.html"
  }
]
