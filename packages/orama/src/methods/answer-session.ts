import type { ChatParams, EmbeddingModel, OramaProxy } from "@oramacloud/client"
import type { AnyDocument, AnyOrama, Nullable, OramaPluginSync, SearchParams, Results } from "../types.js"
import { createError } from "../errors.js"
import { search } from "./search.js"

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
  sources: Nullable<Results<SourceT>>,
  translatedQuery: Nullable<SearchParams<AnyOrama>>,
  error: boolean
  errorMessage: Nullable<string>
}

type AnswerSessionEvents<SourceT = AnyDocument> = {
  onStateChange?: (state: Interaction<SourceT>[]) => void
}

type IAnswerSessionConfig<SourceT = AnyDocument> = {
  model: string,
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

type RegenerateLastParams = {
  stream: boolean
}

const ORAMA_SECURE_PROXY_PLUGIN_NAME = 'orama-secure-proxy'

export class AnswerSession<SourceT = AnyDocument> {
  private db: AnyOrama
  private proxy: Nullable<OramaProxy> = null
  private config: IAnswerSessionConfig<SourceT>
  private abortController: Nullable<AbortController> = null
  private lastInteractionParams: Nullable<AskParams> = null

  private conversationID: string
  private messages: Message[] = []
  private events: AnswerSessionEvents<SourceT>
  private state: Interaction<SourceT>[] = []
  private initPromise?: Promise<true | null>

  constructor(db: AnyOrama, config: IAnswerSessionConfig<SourceT>) {    
    this.db = db
    this.config = config

    this.init()

    this.messages = config.initialMessages || []
    this.events = config.events || {}
    this.conversationID = config.conversationID || this.generateRandomID()
  }


  public async ask(query: AskParams): Promise<string> {
    await this.initPromise

    let output = ''

    for await (const msg of await this.askStream(query)) {
      output += msg
    }

    return output
  }

  public async askStream(query: AskParams): Promise<AsyncGenerator<string>> {
    await this.initPromise

    return this.fetchAnswer(query)
  }

  public abortAnswer() {
    this.abortController?.abort()
    this.state[this.state.length - 1].aborted = true

    if (this.events?.onStateChange) {
      this.events.onStateChange(this.state)
    }
  }

  public getMessages() {
    return this.messages
  }

  public clearSession() {
    this.messages = []
    this.state = []
  }

  public regenerateLast({ stream = true }: RegenerateLastParams) {
    if (this.state.length === 0 || this.messages.length === 0) {
      throw new Error('No messages to regenerate')
    }

    const isLastMessageAssistant = this.messages.at(-1)?.role === 'assistant'

    if (!isLastMessageAssistant) {
      throw new Error('Last message is not an assistant message')
    }

    this.messages.pop()
    this.state.pop()

    if (stream) {
      return this.askStream(this.lastInteractionParams as AskParams)
    }

    return this.ask(this.lastInteractionParams as AskParams)
  }

  private async *fetchAnswer(params: AskParams): AsyncGenerator<string> {
    this.abortController = new AbortController()
    this.lastInteractionParams = params
  
    const interactionId = this.generateRandomID()

    this.messages.push({ role: 'user', content: params.term ?? '' })
  
    this.state.push({
      interactionId,
      aborted: false,
      loading: true,
      query: params.term ?? '',
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

      for await (const msg of this.proxy!.chatStream({ model: this.config.model, messages: this.messages })) {
        yield msg

        this.state[stateIdx].response += msg
        this.messages.findLast(msg => msg.role === 'assistant')!.content += msg

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

  private generateRandomID(length = 24) {
    return Array.from({ length }, () => Math.floor(Math.random() * 36).toString(36)).join('')
  }

  private async init(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    
    async function getPlugin() {
      return await self.db.plugins.find(plugin => (plugin as OramaPluginSync).name === ORAMA_SECURE_PROXY_PLUGIN_NAME)
    }

    const plugin = await getPlugin()

    if (!plugin) {
      throw createError('PLUGIN_SECURE_PROXY_NOT_FOUND')
    }
    
    this.proxy = ((plugin as OramaPluginSync).extra as { proxy: OramaProxy }).proxy

    if (this.config.systemPrompt) {
      this.messages.push({ role: 'system', content: this.config.systemPrompt })
    }
  }

  private addEmptyAssistantMessage() {
    this.messages.push({ role: 'assistant', content: '' })
  }
}
