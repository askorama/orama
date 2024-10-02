import type { AnyDocument, AnyOrama, Nullable, SearchParams, Results } from '../types.js'
export type GenericContext = string | object
export type MessageRole = 'system' | 'user' | 'assistant'
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
  sources: Nullable<Results<SourceT>>
  translatedQuery: Nullable<SearchParams<AnyOrama>>
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
export declare class AnswerSession<SourceT = AnyDocument> {
  private db
  private proxy
  private config
  private abortController
  private lastInteractionParams
  private chatModel
  private conversationID
  private messages
  private events
  private initPromise?
  state: Interaction<SourceT>[]
  constructor(db: AnyOrama, config: IAnswerSessionConfig<SourceT>)
  ask(query: AskParams): Promise<string>
  askStream(query: AskParams): Promise<AsyncGenerator<string>>
  abortAnswer(): void
  getMessages(): Message[]
  clearSession(): void
  regenerateLast({ stream }: RegenerateLastParams): Promise<string> | Promise<AsyncGenerator<string, any, any>>
  private fetchAnswer
  private generateRandomID
  private triggerStateChange
  private init
  private addEmptyAssistantMessage
}
