+++
title = 'Data Processing'
date = 2024-10-28T21:25:50+08:00
draft = false
weight = 4
+++


Let's take a look at the data schema of CSV again. Its structure is

```py
ticket_number,date,caller,application,query,responder,solution,timestamp
```

In this business scenario, we possess a substantial volume of data from call center logs, specifically related to IT support. This data is stored in a traditional SQL server and is exported into CSV or Microsoft Excel formats. The data is:

- Well-structured, divided into specific columns
- The designated column for embedding and storing in a vector database includes the call resolution. Not all columns will be embedded. For instance, querying the caller's name in the vector database is unnecessary. This decision is also pivotal from a performance standpoint when dealing with extensive data volumes.
- Neither too long nor too short in length. In theory, there will be no issues with token size for language model, as each column's width is predetermined, similar to the data length in the example.
- In instances where the `solution` column becomes excessively long due to operators submitting lengthy documents as solutions, we can truncate the column and provide a reference to the full solution in the original database. This way, users can access the complete solution later if needed.


#### Load the CSV and Define `page_content` for Embedding
<!-- #### ~~Embed the selected column in vector database~~ -->

Based on the data schema outlined, the call log record encompasses various columns, such as the caller's name and the timestamp of the call. These elements are not relevant to the call solution and, consequently, embedding them into a vectorstore can lead to increased computational demands and a decrease in search accuracy. Therefore, it is advisable to focus on embedding only the columns that are important for the end user's query, namely the query itself, the application name, and the relevant solution. These are the key pieces of information that users are interested in retrieving.

Below is a code snippet demonstrating how to extract and embed the three specified columns - `query`, `application` name, and `solution` - from a CSV file.

```py
from pprint import pprint

from langchain_community.document_loaders.csv_loader import CSVLoader
loader = CSVLoader(file_path="./reranker_sample.csv",
                   metadata_columns=["ticket_number", "date", "caller",
                                     "responder", "timestamp"])
data = loader.load()
pprint(data[0])
```

The output appears to be

```py
Document(page_content="application: Windows Operating System\nquery: I'm having trouble logging into my account. I keep getting an error message saying my password is incorrect, even though I know I'm entering it correctly.\nsolution: Verified the user's account information and reset their password. Provided step-by-step instructions on how to log in with the new password.",
metadata={'source': './240409_contextCompression.csv', 'row': 0, 'ticket_number': '000001', 'date': '2024-04-01', 'caller': 'John Doe', 'responder': 'Jane Smith', 'timestamp': '2024-04-01 10:15:23'})
```

<!-- From the output, we can see that Document's `page_content` contains the solution related information and `ticket_number`, `date`, and `caller` go to `metadata`, where `page_content` will be embedded and inserted into vectorstore. -->

The output reveals that the `page_content` of the Document contains information relevant to the solution, including `application` name, `query` of the call, and `solution`, while the `ticket_number`, `date`, and `caller` are categorized under `metadata`. The `page_content` will be embedded and then inserted into the vector store. `source` within `metadata`, by default, contains the original document name and path, which indicates the source of the information.
