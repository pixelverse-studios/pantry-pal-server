import BaseResolver from '../../baseResolver.js'
import PatchNotes from '../../../models/PatchNotes.js'
import { Command, Topic, logError, logInfo } from '../../../utils/logger.js'

class PatchNotesController extends BaseResolver {
  constructor() {
    super()

    this.addedErrors = {}
    this.errors = { ...this.errors, ...this.addedErrors }
    this.typenames = {
      single: 'PatchNote',
      multi: 'PatchNotes'
    }
  }
  catchError(action, { topic, operation }, error) {
    logError(topic, operation, error)
    return this.catchError(action)
  }
  async getAll(ctx) {
    const patchNotes = await PatchNotes.find()
    if (patchNotes?.length == 0) {
      this.error = this.errors.notFound(this.typenames.multi)
      return this.handleError(
        Topic.PatchNotes,
        ctx.operation,
        'System has no patch notes'
      )
    }
    return this.handleMultiItemSuccess(patchNotes)
  }
  async create(
    {
      title,
      description,
      datePublished,
      display,
      targetDate,
      targetVersion,
      graphic
    },
    ctx
  ) {
    const note = await PatchNotes.findOne({ title })
    if (note != null) {
      this.error = this.errors.duplicateItem(this.typenames.single)
      return this.handleError(
        Topic.PatchNotes,
        ctx.operation,
        `Duplicate patch note for ${title}`
      )
    }

    logInfo(Topic.PatchNotes, ctx.operation, `${Command.Add} ${title}`)
    const { dateToUTC } = this.formatters.date
    const newNote = new PatchNotes({
      title,
      description,
      datePublished: datePublished != null ? dateToUTC(datePublished) : null,
      display,
      targetDate: targetDate != null ? dateToUTC(targetDate) : null,
      targetVersion,
      graphic,
      updatedAt: Date.now()
    })
    await newNote.save()
    const allNotes = await PatchNotes.find()
    return this.handleMultiItemSuccess(allNotes)
  }
  async edit({ id, ...rest }, ctx) {
    const note = await PatchNotes.findById(id)
    if (note == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError(
        Topic.PatchNotes,
        ctx.operation,
        `Patch note ${id} was not found`
      )
    }
    logInfo(Topic.PatchNotes, ctx.operation, `${Command.Add} ${note.title}`)
    this.buildPayload({ ...rest }, note)
    await PatchNotes.findOneAndUpdate(
      { _id: id },
      {
        ...this.payload,
        updatedAt: Date.now()
      }
    )
    return this.handleMultiItemSuccess(await PatchNotes.find())
  }
  async delete({ id }, ctx) {
    const note = await PatchNotes.findById(id)
    if (note == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError(
        Topic.PatchNotes,
        ctx.operation,
        `Patch note ${id} was not found`
      )
    }

    logInfo(Topic.PatchNotes, ctx.operation, `${Command.Add} ${note.title}`)

    await PatchNotes.findOneAndDelete(id)
    return this.handleMultiItemSuccess(await PatchNotes.find())
  }
  async publish({ id, ...rest }, ctx) {
    const note = await PatchNotes.findById(id)
    if (note == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError(
        Topic.PatchNotes,
        ctx.operation,
        `Patch note ${id} was not found`
      )
    }
    this.buildPayload({ ...rest }, note)
    await PatchNotes.findByIdAndUpdate(
      { _id: id },
      {
        ...this.payload,
        updatedAt: Date.now()
      }
    )
    return this.handleMultiItemSuccess(await PatchNotes.find())
  }
}

export default PatchNotesController
