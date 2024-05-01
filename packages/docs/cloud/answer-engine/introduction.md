# The Orama Answer Engine

Orama is an answer engine. When you integrate your data, it will create an RAG pipeline to let you ask questions about your data and get precise, reliable answers back.

To get started with the Orama answer engine, simply [create a new index](/cloud/working-with-indexes/create-a-new-index) and enable [automatic embedding generation](/cloud/orama-ai/automatic-embeddings-generation).

At the time of writing, you will also need to [set up an OpenAI API key](/cloud/orama-ai/automatic-embeddings-generation#using-openai) to make the Answer engine work, as it will use OpenAI's **GPT 3.5 Turbo** model to generate the answers.

We will release more integrations with more LLMs soon:

| LLM Provider | Model           | Support            |
| ------------ | --------------- | ------------------- |
| OpenAI       | GPT 3.5 Turbo   | ✅ Supported        |
| OpenAI       | GPT 4 Turbo     | 🔜 Supported soon   |
| OpenAI       | GPT 4           | 🔜 Supported soon   |
| Anthropic    | Claude 3 Opus   | 🚧 Work in progress |
| Anthropic    | Claude 3 Sonnet | 🚧 Work in progress |
| Google       | Gemini Ultra    | 🚧 Work in progress |
| Google       | Gemini 1.5 Pro  | 🚧 Work in progress |
| Mistral      | Mistral Large   | 🚧 Work in progress |
| Mistral      | Mistral Medium  | 🚧 Work in progress |
| Mistral      | Mistral Small   | 🚧 Work in progress |

This is all you’ll need to trigger the Orama RAG pipeline.