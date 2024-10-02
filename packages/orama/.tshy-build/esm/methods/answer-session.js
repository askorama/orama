import { createError } from '../errors.js'
import { search } from './search.js'
const ORAMA_SECURE_PROXY_PLUGIN_NAME = 'orama-secure-proxy'
export class AnswerSession {
  db
  proxy = null
  config
  abortController = null
  lastInteractionParams = null
  chatModel = null
  conversationID
  messages = []
  events
  initPromise
  state = []
  constructor(db, config) {
    this.db = db
    this.config = config
    this.init()
    this.messages = config.initialMessages || []
    this.events = config.events || {}
    this.conversationID = config.conversationID || this.generateRandomID()
  }
  async ask(query) {
    await this.initPromise
    let output = ''
    for await (const msg of await this.askStream(query)) {
      output += msg
    }
    return output
  }
  async askStream(query) {
    await this.initPromise
    return this.fetchAnswer(query)
  }
  abortAnswer() {
    this.abortController?.abort()
    this.state[this.state.length - 1].aborted = true
    this.triggerStateChange()
  }
  getMessages() {
    return this.messages
  }
  clearSession() {
    this.messages = []
    this.state = []
  }
  regenerateLast({ stream = true }) {
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
      return this.askStream(this.lastInteractionParams)
    }
    return this.ask(this.lastInteractionParams)
  }
  async *fetchAnswer(params) {
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
      for await (const msg of this.proxy.chatStream({ model: this.chatModel, messages: this.messages })) {
        yield msg
        this.state[stateIdx].response += msg
        this.messages.findLast((msg) => msg.role === 'assistant').content += msg
        this.triggerStateChange()
      }
    } catch (err) {
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
  generateRandomID(length = 24) {
    return Array.from({ length }, () => Math.floor(Math.random() * 36).toString(36)).join('')
  }
  triggerStateChange() {
    if (this.events.onStateChange) {
      this.events.onStateChange(this.state)
    }
  }
  async init() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    async function getPlugin() {
      return await self.db.plugins.find((plugin) => plugin.name === ORAMA_SECURE_PROXY_PLUGIN_NAME)
    }
    const plugin = await getPlugin()
    if (!plugin) {
      throw createError('PLUGIN_SECURE_PROXY_NOT_FOUND')
    }
    const pluginExtras = plugin.extra
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
  addEmptyAssistantMessage() {
    this.messages.push({ role: 'assistant', content: '' })
  }
}
//# sourceMappingURL=answer-session.js.map
