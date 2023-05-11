/* eslint-disable @typescript-eslint/no-var-requires */

const { stemmer: arabic } = require('./ar.js')
const { stemmer: armenian } = require('./am.js')
const { stemmer: bulgarian } = require('./bg.js')
const { stemmer: danish } = require('./dk.js')
const { stemmer: dutch } = require('./nl.js')
const { stemmer: english } = require('./en.js')
const { stemmer: finnish } = require('./fi.js')
const { stemmer: french } = require('./fr.js')
const { stemmer: german } = require('./de.js')
const { stemmer: greek } = require('./gr.js')
const { stemmer: hungarian } = require('./hu.js')
const { stemmer: indian } = require('./in.js')
const { stemmer: indonesian } = require('./id.js')
const { stemmer: irish } = require('./ie.js')
const { stemmer: italian } = require('./it.js')
const { stemmer: lithuanian } = require('./lt.js')
const { stemmer: nepali } = require('./np.js')
const { stemmer: norwegian } = require('./no.js')
const { stemmer: portuguese } = require('./pt.js')
const { stemmer: romanian } = require('./ro.js')
const { stemmer: russian } = require('./ru.js')
const { stemmer: serbian } = require('./rs.js')
const { stemmer: slovenian } = require('./ru.js')
const { stemmer: spanish } = require('./es.js')
const { stemmer: swedish } = require('./se.js')
const { stemmer: turkish } = require('./tr.js')
const { stemmer: ukrainian } = require('./uk.js')

module.exports = {
  arabic,
  armenian,
  bulgarian,
  danish,
  dutch,
  english,
  finnish,
  french,
  german,
  greek,
  hungarian,
  indian,
  indonesian,
  irish,
  italian,
  lithuanian,
  nepali,
  norwegian,
  portuguese,
  romanian,
  russian,
  serbian,
  slovenian,
  spanish,
  swedish,
  turkish,
  ukrainian,
}
