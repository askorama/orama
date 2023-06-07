const dataset = require('../datasets/events.json')

const events = dataset.result.events

module.exports = {
  formattedEvents: events.map(event => ({
    date: event.date,
    description: event.description,
    categories: {
      first: event.category1 ?? '',
      second: event.category2 ?? '',
    },
  })),
}
