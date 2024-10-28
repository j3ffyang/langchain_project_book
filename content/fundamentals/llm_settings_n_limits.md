+++
title = 'LLM Settings and Limits'
date = 2024-10-28T17:58:27+08:00
draft = false
weight = 3
+++

### LLM Settings

When working with prompts, you can communicate directly or through an API with the LLM. A few parameters can be set to get different outcomes for your prompts.

- `temperature`: In other words, results are more deterministic when the `temperature` is lower because the next most likely token is always selected. A higher `temperature` may cause more unpredictability, which promotes more varied or imaginative results. In essence, you are making the other potential tokens heavier. In order toTo encourage more factual and succinct responses, you might want to apply a lower `temperature` value for tasks like fact-based quality assurance. It could be useful to raise the `temperature` value for writing poems or other creative tasks. The impact of adjusting this value can vary significantly based on the settings of the pre-trained model. Hence, it is advisable to experiment with and fine-tune this parameter according to the specific models to align with your requirements.

- `top_k`: In text generation, a language model predicts the next word by analyzing preceding words. While one common method involves choosing the word with the highest probability, known as "greedy decoding," it can lead to repetitive and incoherent text. This is where sampling methods such as Top-K sampling offer a solution.
Top-K sampling simplifies the process by restricting the selection to the K most probable next words from the vocabulary, allowing for more varied and coherent text generation.

<!-- The Top-K method, at its core, imposes a restriction on the number of tokens under consideration; for example, setting `top_k = 4` means only the top `4` tokens are viable, while the remainder are disregarded.
In the realm of the `top_k` technique, it influences how a language system chooses words to craft its responses. When employing a low `k` value, the AI follows a comparable pattern by selecting from a restricted and foreseeable pool of words. While this strategy ensures response consistency, it may result in somewhat predictable outputs, potentially lacking in diversity as it doesn't explore the array of options beyond the surface level.
In a project I worked on, the client requested the identification of the top 10 similar answers from a knowledge-base database, with the `top_k` value configured as `10`.  -->

- `top_p`: Top-K sampling limits the selection to the K most probable next words, whereas Top-P sampling, also referred to as "nucleus sampling," introduces a different approach. Rather than defining a fixed number of top candidates (K), it involves setting a probability mass (P) and sampling exclusively from the smallest subset of words with a combined probability exceeding P.
<!-- In the case of `top_p`, the value ranges between 0 and 1. It selects tokens based on their cumulative probabilities until the total surpasses the specified `top_p` value. For instance, a `top_p` value of 0.8 indicates that tokens with cumulative probabilities exceeding 0.8 will be included in the selection. In another word, you can regulate how deterministic the model is in producing a response by using `top_p`, a temperature-based sampling method known as nucleus sampling. Keep this low if you're searching for precise and factual responses. A higher value will yield more varied responses, so consider that. Generally speaking, you should change `top_p` or `temperature`, but not both.   -->

- `max_length`: By changing the `max_length`, you can control how many tokens the model produces. You can avoid lengthy or irrelevant responses and keep costs under control by setting a maximum length.

- `max_new_tokens`: The maximum numbers of tokens to generate, ignoring the number of tokens in the prompt.

<!-- Reference > https://huggingface.co/docs/transformers/main_classes/text_generation -->

The above are the default parameters in settings that we use for our projects. We’ll go through them in real code later in this book.

### LLM Limitations

While LLMs in LangChain technology have many advantages, they also come with several limitations:

- **Computational Resources**: Training LLMs require significant computational resources, which can be expensive and time-consuming. Even smaller models can take days or weeks to train on powerful hardware.
- **Data Requirement**: LLMs require large amounts of diverse and high-quality data for training. Gathering such data can be challenging, and biases in the training data can lead to biased model outputs. This obstacle poses a significant challenge in my practical experience, hindering the fine-tuning of my domain-specific model and dissuading me from training my own model.
- **Model Interpretability**: LLMs are often seen as "black boxes" because their internal workings are complex and not easily understood. This makes it difficult to diagnose and fix issues when the model produces incorrect or unexpected results. It is anticipated that a growing number of open-source LLMs will be introduced within the community to offer enhanced domain-specific capabilities and greater control over data processing workflows.
- **Adaptability**: While LLMs are good at general tasks, they may not perform well in specific domains without fine-tuning. Fine-tuning itself can be tricky and requires domain-specific data. In my personal experience, every client I work with demands industry-specific solutions and robust data security measures. Addressing these requirements entails incorporating extensive additional knowledge into project design and implementation, which can pose a challenge for enterprises looking to integrate generative AI within certain industries.
- **Ethical Concerns**: LLMs can generate inappropriate or offensive content if not properly controlled. They might also inadvertently leak sensitive information if they were trained on such data.
- **Dependency on Language**: LLMs perform best on languages with a large amount of available training data, typically English. Performance might degrade for low-resource languages. A notable advantage I discovered is the ease with which LLMs handle language translation without the need for complex configurations. In my experience, we experimented with utilizing a pure English LLM to generate responses directly, rather than employing language-specific models for non-English languages and then translating as needed, all while customizing prompt instructions.
- **Limitations in Understanding**: While LLMs can generate human-like text, they actually don't understand the content they're generating. They can't make logical inferences outside of their training data or handle tasks that require common sense.
- **Environmental Impact**: The energy consumption for training LLMs can be substantial, leading to a significant carbon footprint.

In conclusion, while LLMs are powerful tools in LangChain technology, they do come with their own set of challenges. It's crucial to be aware of these limitations when implementing and using these models in real case.
