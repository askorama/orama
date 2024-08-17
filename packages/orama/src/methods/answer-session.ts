import type { ChatParams, EmbeddingModel, OramaProxy } from "@oramacloud/client"
import type { AnyDocument, AnyOrama, Nullable, OramaPluginSync, SearchParams, Results } from "../types.js"
import { pluginSecureProxy } from '@orama/plugin-secure-proxy'
import { createError } from "../errors.js"
import { search } from "./search.js"
import { create } from "./create.js"
import { insert } from "./insert.js"

type GenericContext =
  | string
  | object

type MessageRole =
  | 'system'
  | 'user'
  | 'assistant'

type RelatedFormat =
  | 'query'
  | 'question'

type Message = {
  role: MessageRole
  content: string
}

type Interaction<SourceT = AnyDocument> = {
  interactionId: string
  query: string
  response: string
  aborted: boolean
  loading: boolean
  relatedQueries: Nullable<string[]>
  sources: Nullable<Results<SourceT>>,
  translatedQuery: Nullable<SearchParams<AnyOrama>>,
  error: boolean
  errorMessage: Nullable<string>
}

type AnswerSessionEvents<SourceT = AnyDocument> = {
  onStateChange?: (state: Interaction<SourceT>[]) => void
}

type IAnswerSessionConfig<SourceT = AnyDocument> = {
  conversationID?: string
  systemPrompt?: string
  userContext?: GenericContext
  initialMessages?: Message[]
  events?: AnswerSessionEvents<SourceT>
}

type AskParams = SearchParams<any> & {
  userData?: GenericContext
  rag?: {
    embeddingsModel: EmbeddingModel
    llm: ChatParams['model']
  }
  related?: {
    howMany?: number,
    format?: RelatedFormat
  }
}

// type RegenerateLastParams = {
//   stream: boolean
// }

const ORAMA_SECURE_PROXY_PLUGIN_NAME = 'orama-secure-proxy'

export class AnswerSession<SourceT = AnyDocument> {
  private db: AnyOrama
  private proxy: OramaProxy
  private config: IAnswerSessionConfig<SourceT>
  private abortController: Nullable<AbortController> = null

  private hasSecureProxy: boolean = false

  private conversationID: string
  private messages: Message[] = []
  private events: AnswerSessionEvents<SourceT>
  private state: Interaction<SourceT>[] = []

  constructor(db: AnyOrama, config: IAnswerSessionConfig<SourceT>) {
    this.db = db
    this.config = config
  
    this.detectSecureProxy()

    if (!this.hasSecureProxy) {
      throw createError('PLUGIN_SECURE_PROXY_NOT_FOUND')
    }

    this.proxy = this.getProxy()
    this.messages = config.initialMessages || []
    this.events = config.events || {}
    this.conversationID = config.conversationID || this.generateRandomID()
  }


  public async ask(query: AskParams): Promise<string> {
    let output = ''

    for await (const msg of await this.askStream(query)) {
      output += msg
    }

    return output
  }

  public async askStream(query: AskParams): Promise<AsyncGenerator<string>> {
    this.messages.push({ role: 'user', content: query.term ?? '' })

    return this.fetchAnswer(query)
  }

  public abortAnswer() {

  }

  public getMessages() {
    return this.messages
  }

  // public regenerateLast(params: RegenerateLastParams) {

  // }

  public clearSession() {
    this.messages = []
    this.state = []
  }

  private async *fetchAnswer(params: AskParams): AsyncGenerator<string> {
    this.abortController = new AbortController()
    const interactionId = this.generateRandomID()

    this.messages.push({ role: 'user', content: params.term ?? '' })
  
    this.state.push({
      interactionId,
      aborted: false,
      loading: true,
      query: params.term ?? '',
      relatedQueries: null,
      response: '',
      sources: null,
      translatedQuery: null,
      error: false,
      errorMessage: null
    })

    const stateIdx = this.state.length - 1
    this.addEmptyAssistantMessage()

    if (this.events?.onStateChange) {
      this.events.onStateChange(this.state)
    }

    try {
      const sources = await search(this.db, params)

      this.state[stateIdx].sources = sources

      for await (const msg of this.proxy.chatStream({ model: 'gpt-4o-mini', messages: this.messages })) {
        yield msg

        this.state[stateIdx].response += msg

        if (this.events?.onStateChange) {
          this.events.onStateChange(this.state)
        }
      }

    } catch (err: any) {
      
      if (err.name === 'AbortError') {
        this.state[stateIdx].aborted = true

        if (this.events?.onStateChange) {
          this.events.onStateChange(this.state)
        }
      } else {
        this.state[stateIdx].error = true
        this.state[stateIdx].errorMessage = err.message

        if (this.events?.onStateChange) {
          this.events.onStateChange(this.state)
        }
      }

    }

    this.state[stateIdx].loading = false

    if (this.events?.onStateChange) {
      this.events.onStateChange(this.state)
    }

    return this.state[stateIdx].response
  }

  private detectSecureProxy() {
    try {
      const idx = this.db.plugins.findIndex((plugin: any) => (plugin as OramaPluginSync).name === ORAMA_SECURE_PROXY_PLUGIN_NAME)
      this.hasSecureProxy = idx > -1
    } catch (err) {
      this.hasSecureProxy = false
    }
  }

  private generateRandomID(length = 24) {
    return Array.from({ length }, () => Math.floor(Math.random() * 36).toString(36)).join('')
  }

  private getProxy(): OramaProxy {
    try {
      const { extra } = this.db.plugins.findIndex((plugin: any) => (plugin as OramaPluginSync).name === ORAMA_SECURE_PROXY_PLUGIN_NAME)[0]
      
      return extra.proxy as OramaProxy
    } catch (err) {
      throw createError('PLUGIN_SECURE_PROXY_NOT_FOUND')
    }
  }

  private addEmptyAssistantMessage() {
    this.messages.push({ role: 'assistant', content: '' })
  }
}


async function main() {
  const db = await create({
    schema: {
      name: 'string'
    } as const,
    plugins: [
      pluginSecureProxy({
        apiKey: 'k575onhi-YeQHrOSAjDZc-BfM0dBkgA2',
        defaultProperty: 'embeddings',
        model: 'gpt-4o-mini'
      })
    ]
  })

  await insert(db, { name: 'John Doe' })
  await insert(db, { name: 'Michele Riva' })

  const session = new AnswerSession(db, {
    systemPrompt: 'You will get a name as context, please provide a greeting message',
  })

  await session.ask({
    term: 'john',
  })
}

main()