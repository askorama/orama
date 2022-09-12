import dataset from '../../../tests/datasets/events.json' assert { type: 'json' }

export const events = dataset.result.events

export const formattedEvents = events.map(event => ({
  date: event.date,
  description: event.description,
  categories: {
    first: event.category1 ?? '',
    second: event.category2 ?? ''
  }
}))