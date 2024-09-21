import { dateToLocal } from './format/dates.js'

const LogLevel = {
  Error: { label: 'ERROR', level: 0 },
  Warning: { label: 'WARNING', level: 1 },
  Info: { label: 'INFO', level: 2 },
  Debug: { label: 'DEBUG', level: 3 }
}

export const Topic = {
  CommonCategory: 'common-category',
  CustomCategory: 'custom-category',
  Faqs: 'faqs',
  Feedback: 'feedback',
  Filters: 'filters',
  Food: 'food api',
  PatchNotes: 'patch-notes',
  Recipe: 'recipe',
  User: 'user',
  User_Categories: 'user-categories'
}

export const Command = {
  Add: 'Processing ADD of',
  Edit: 'Processing EDIT of',
  Delete: 'Proccessing DELETE of',
  Delete_Ids: 'Processing DELETE of IDs: ',
  Delete_Labels: 'Processing DELETE of Labels: ',
  Fetch: 'Fetching ',
  Register: 'Adding new user '
}

const logMessage = (topic, level, operation, ...args) => {
  const now = Date.now()
  console.log(`${level.label} [${topic}] @ ${dateToLocal(now)}`)
  console.log(`Operation ${operation}: ${args}`)
}

export const logDebug = (topic, operation, ...args) =>
  logMessage(topic, LogLevel.Debug, operation, ...args)
export const logWarning = (topic, operation, ...args) =>
  logMessage(topic, LogLevel.Warning, operation, ...args)
export const logInfo = (topic, operation, ...args) =>
  logMessage(topic, LogLevel.Info, operation, ...args)
export const logError = (topic, operation, ...args) =>
  logMessage(topic, LogLevel.Error, operation, ...args)
