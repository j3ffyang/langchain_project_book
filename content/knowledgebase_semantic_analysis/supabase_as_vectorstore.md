+++
title = 'Supabase as VectorStore'
date = 2024-10-28T22:26:09+08:00
draft = false
weight = 4
+++


We will introduce Supabase as a vector store and walk through the process of storing various embeddings in Supabase Vector, a combination of PostgreSQL and `pgVector`, aimed at facilitating semantic search.

Supabase, an open-source alternative to Firebase, is constructed atop PostgreSQL, a robust SQL database suitable for production environments. Given that Supabase Vector is built on `pgVector`, it allows for the storage of embeddings alongside other application data within the same database. This integration with `pgvector`'s indexing algorithms ensures that vector searches remain efficient even at large scales.

Supabase further enhances app development by offering a range of services and tools, including an auto-generated REST API, to streamline the storage and querying of embeddings within PostgreSQL. Additionally, Supabase provides a user-friendly interface that simplifies the interaction with SQL editors and database components, making it easier to manage and manipulate data.


Our goal in this business case is to utilize Supabase as a vector store, focusing on the following objectives:

- Leverage the open-source nature of PostgreSQL with the `vector` extension for efficient vector storage.
- Manage both data and extensions seamlessly within the Supabase UI, ensuring ease of use and control.
- Ensure vector data is stored persistently, maintaining integrity and availability for future use.
- Integrate with LangChain.

#### Installing Self-Hosting with Docker

There are multiple methods to install Supabase, and we will focus on self-hosting with Docker. Alternatively, you can opt for the Supabase online service, eliminating the need to manage its infrastructure yourself.

One of the advantages of self-hosting Supabase is the assurance of persistent local storage for all data, ensuring that queries and responses remain within your private network for enhanced security.

Let's assume that you already have had `git` and `docker` installed and configured properly.

```sh
# Get the code
git clone --depth 1 https://github.com/supabase/supabase

# Go to the docker folder
cd supabase/docker

# Copy the fake env vars
cp .env.example .env

# Pull the latest images
docker compose pull

# Start the services (in detached mode)
docker compose up -d
```

It may take a while to download the images within your Docker environment. When it's done, the output looks like this.

```sh
[+] Running 12/13
 ⠴ Network supabase_default                  Created           19.6s
 ✔ Container supabase-imgproxy               Started            1.1s
 ✔ Container supabase-vector                 Healthy            6.4s
 ✔ Container supabase-db                     Healthy           12.1s
 ✔ Container supabase-analytics              Healthy           17.8s
 ✔ Container supabase-auth                   Started           18.7s
 ✔ Container supabase-meta                   Started           18.5s
 ✔ Container supabase-edge-functions         Started           18.7s
 ✔ Container realtime-dev.supabase-realtime  Started           18.5s
 ✔ Container supabase-studio                 Started           18.9s
 ✔ Container supabase-kong                   Started           18.5s
 ✔ Container supabase-rest                   Started           18.1s
 ✔ Container supabase-storage                Started           18.9s
```

For more information about self-hosting install, here's the official documentation

> Reference > https://supabase.com/docs/guides/self-hosting/docker#accessing-supabase-dashboard

#### Configuring Vector for Embedding

It's important to note that when using the `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` embedding model, the dimensionality of the embedding vector is `384`. This detail must be considered when changing the embedding model, as it affects the configuration of the vector database with Supabase.

After all Docker containers have been fully created and launched, you can access the Supabase portal at http://127.0.0.1:8000/. The default user ID and password can be found in `supabase/docker/.env`.

```sh
DASHBOARD_USERNAME=supabase
DASHBOARD_PASSWORD=this_password_is_insecure_and_should_be_updated
```

It is strongly recommended to change these default values for security reasons, especially if running in a production environment.

Please be aware that if you modify these values in the `supabase/docker/.env` file, you must restart all the containers to apply the updates. This can be done using the following commands:

```sh
cd supabase/docker
docker compose down
docker compose up -d
```

> Security Warning: The IP address on port 8000 is intended to be accessible from anywhere on the network. Therefore, it is not advisable to expose this directly to the internet without first setting up a proper firewall configuration.


After you successfully log into the portal, you can see

![](images/2024-05-01-21-22-34.png)
<center>Figure 5.2 Supabase Dashboard</center>

<!-- First, select `Database` from navigation panel,  -->

Select `SQL Editor` from navigation panel, copy and paste the following SQL into `SQL Query`, then click `Run`. The SQL code creates an extension of `vector` and a table called `documents` which will be used to store the embedded documents.

```sql
-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your documents
create table
  documents (
    id uuid primary key,
    content text, -- corresponds to Document.pageContent
    metadata jsonb, -- corresponds to Document.metadata
    embedding vector (384) -- 384 works for Sentence-Transformers embeddings, change if needed
  );

-- Create a function to search for documents
create function match_documents (
  query_embedding vector (384),
  filter jsonb default '{}'
) returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
) language plpgsql as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding;
end;
$$;
```

> Note: Since we are utilizing the `sentence-transformers/paraphrase-multilingual` model for embeddings, it is necessary to set the "embedding vector" value to `384`.

If you need to switch to OpenAI's embedding model, you'll have to specify the vector value. Here's an example:

```sql
ALTER TABLE documents
ALTER COLUMN embedding TYPE vector(1536);
```

Upon completion of the execution, you will discover a database named "documents" under "Database" and an extension named "vector" located under "Extensions."

For detailed documentation of LangChain with Supabase, you may want to check

> Reference > https://python.langchain.com/docs/integrations/vectorstores/supabase/

<!-- On macOS, you might encounter a problem that two containers, `supabase-meta` and `supabase-studio` keep restarting. The issue can be fixed by disabling `Use Virtualization framework` and switching file sharing implementation from `VirtioFS` to `gRPC FUSE`. The Docker Desktop edition is `4.29.0` -->

On macOS, you may experience an issue where the containers `supabase-meta` and `supabase-studio` continuously restart. This problem can be resolved by disabling the "Use Virtualization Framework" option and changing the file sharing implementation from "VirtioFS" to "gRPC FUSE". This solution applies to Docker Desktop version `v4.29.0`.

Settings > General > Use Virtualization framework > select "gRPC FUSE" then un-check "Use Virtualization framework"

![](images/2024-05-07-11-29-17.png)
<center>Figure 5.3 Change Virtualization framework for Supabase on macOS</center>

> Reference > https://github.com/supabase/cli/issues/1724

#### Accessing the APIs

Upon completing the Supabase configuration, it's necessary to identify the API service key for LangChain, which will be responsible for managing Supabase as the vector store. This key can be found in the section of `ANON_KEY`.


```sh
cd supabase/docker
cat .env
```

The `ANON_KEY` is API service key.

```bash
############
# Secrets
# YOU MUST CHANGE THESE BEFORE GOING INTO PRODUCTION
############

POSTGRES_PASSWORD=your-super-secret-and-long-postgres-password
JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q
DASHBOARD_USERNAME=supabase
DASHBOARD_PASSWORD=this_password_is_insecure_and_should_be_updated
```

> Security Warning: the API key and password used here are default values without any modifications. For production environments, it's crucial to update all passwords and API keys to enhance security. You can visit the following website to update and modify your keys.

https://supabase.com/docs/guides/self-hosting/docker#securing-your-services


<!-- #### Operating Supabase

```sh
docker compose down
docker compose up -d
``` -->

#### Inserting the Embedded Data into VectorStore with `SupabaseVectorStore.from_documents`

After establishing the documents table in the database, we proceed to insert the embedded data into it using `SupabaseVectorStore.from_documents` and define the vector store.

```py
import os
import getpass
os.environ["SUPABASE_URL"] = getpass.getpass("Supabase URL: ")
os.environ["SUPABASE_SERVICE_KEY"] = getpass.getpass("Supabase Svc Key: ")

from langchain_community.vectorstores import SupabaseVectorStore
from supabase.client import Client, create_client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

vectorstore = SupabaseVectorStore.from_documents(
    chunks,
    embeddings,
    client=supabase,
    table_name="documents",
    query_name="match_documents",
    chunk_size=500,
)
```

Once the embedded data has been loaded, you can execute queries against the vector store using the `SupabaseVectorStore` function, instead of `SupabaseVectorStore.from_documents`, without the need to reload the data into the vector store. We'll see the code below.
