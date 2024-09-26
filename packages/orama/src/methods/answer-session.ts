import type { OramaProxy, ChatModel } from "@oramacloud/client"
import type { AnyDocument, AnyOrama, Nullable, OramaPluginSync, SearchParams, Results } from "../types.js"
import { createError } from "../errors.js"
import { search } from "./search.js"

export type GenericContext =
  | string
  | object

export type MessageRole =
  | 'system'
  | 'user'
  | 'assistant'

export type Message = {
  role: MessageRole
  content: string
}

export type Interaction<SourceT = AnyDocument> = {
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

export type AnswerSessionEvents<SourceT = AnyDocument> = {
  onStateChange?: (state: Interaction<SourceT>[]) => void
}

export type IAnswerSessionConfig<SourceT = AnyDocument> = {
  conversationID?: string
  systemPrompt?: string
  userContext?: GenericContext
  initialMessages?: Message[]
  events?: AnswerSessionEvents<SourceT>
}

export type AskParams = SearchParams<AnyDocument>

export type RegenerateLastParams = {
  stream: boolean
}

const ORAMA_SECURE_PROXY_PLUGIN_NAME = 'orama-secure-proxy'

export class AnswerSession<SourceT = AnyDocument> {
  private db: AnyOrama
  private proxy: Nullable<OramaProxy> = null
  private config: IAnswerSessionConfig<SourceT>
  private abortController: Nullable<AbortController> = null
  private lastInteractionParams: Nullable<AskParams> = null
  private chatModel: Nullable<ChatModel> = null

  private conversationID: string
  private messages: Message[] = []
  private events: AnswerSessionEvents<SourceT>
  private initPromise?: Promise<true | null>
  public state: Interaction<SourceT>[] = []

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

    this.triggerStateChange()
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
      throw createError('ANSWER_SESSION_LAST_MESSAGE_IS_NOT_ASSISTANT')
    }

    this.messages.pop()
    this.state.pop()

    if (stream) {
      return this.askStream(this.lastInteractionParams as AskParams)
    }

    return this.ask(this.lastInteractionParams as AskParams)
  }

  private async *fetchAnswer(params: AskParams): AsyncGenerator<string> {
    if (!this.chatModel) {
      throw createError('PLUGIN_SECURE_PROXY_MISSING_CHAT_MODEL')
    }

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
    this.triggerStateChange()

    try {
      const sources = await search(this.db, params)

      this.state[stateIdx].sources = sources
      this.triggerStateChange()

      for await (const msg of this.proxy!.chatStream({ model: this.chatModel, messages: this.messages })) {
        yield msg

        this.state[stateIdx].response += msg
        this.messages.findLast(msg => msg.role === 'assistant')!.content += msg

        this.triggerStateChange()
      }

    } catch (err: any) {
      if (err.name === 'AbortError') {
        this.state[stateIdx].aborted = true
      } else {
        this.state[stateIdx].error = true
        this.state[stateIdx].errorMessage = err.toString()
      }

      this.triggerStateChange()
    }

    this.state[stateIdx].loading = false
    this.triggerStateChange()

    return this.state[stateIdx].response
  }

  private generateRandomID(length = 24) {
    return Array.from({ length }, () => Math.floor(Math.random() * 36).toString(36)).join('')
  }

  private triggerStateChange() {
    if (this.events.onStateChange) {
      this.events.onStateChange(this.state)
    }
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

    const pluginExtras = plugin.extra as { proxy: OramaProxy, pluginParams: { chat: { model: ChatModel } } }

    this.proxy = pluginExtras.proxy

    if (this.config.systemPrompt) {
      this.messages.push({ role: 'system', content: this.config.systemPrompt })
    }

    if (pluginExtras?.pluginParams?.chat?.model) {
      this.chatModel = pluginExtras.pluginParams.chat.model
    } else {
      throw createError('PLUGIN_SECURE_PROXY_MISSING_CHAT_MODEL')
    }
  }

  private addEmptyAssistantMessage() {
    this.messages.push({ role: 'assistant', content: '' })
  }
}
