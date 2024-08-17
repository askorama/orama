```js
import { create, insert, answerSession } from "@orama/orama"


const db = await create({
  schema: {
    name: 'string',
    embeddings: 'vector[532]'
  }
})

await insert(db, {
  name: 'John Doe',
  embeddings: [0.9123, 0.243, 0.4234, 0.14434]
})

const answerSession = new AnswerSession(db, {
  events: {
    onStateChange: (state) => console.log(state)
  }
})

const response = await answerSession.ask({
  term: 'Who is John Doe?'
  mode: 'hybrid'
})
```