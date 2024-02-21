import BaseResolver from '../../baseResolver.js'
import PatchNotes from '../../../models/PatchNotes.js'

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
  catchError(action) {
    return this.catchError(action)
  }
  async getAll() {
    const patchNotes = await PatchNotes.find()
    if (patchNotes?.length == 0) {
      this.error = this.errors.notFound(this.typenames.multi)
      return this.handleError()
    }
    return this.handleMultiItemSuccess(this.typenames.multi, patchNotes)
  }
  async create({
    title,
    description,
    datePublished,
    display,
    targetDate,
    targetVersion,
    graphic
  }) {
    const note = await PatchNotes.findOne({ title })
    if (note != null) {
      this.error = this.errors.duplicateItem(this.typenames.single)
      return this.handleError()
    }

    const { dateToUTC } = this.formatters.date
    const newNote = new PatchNotes({
      title,
      description,
      datePublished: datePublished != null ? dateToUTC(datePublished) : null,
      display,
      targetDate: targetDate != null ? dateToUTC(targetDate) : null,
      targetVersion,
      graphic,
      updatedAt: dateToUTC(new Date())
    })
    await newNote.save()
    const allNotes = await PatchNotes.find()
    return this.handleMultiItemSuccess(this.typenames.multi, allNotes)
  }
  async edit({ id, ...rest }) {
    const note = await PatchNotes.findById(id)
    if (note == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError()
    }

    this.buildPayload({ ...rest }, note)
    const { dateToUTC } = this.formatters.date

    await PatchNotes.findOneAndUpdate(
      { _id: id },
      {
        ...this.payload,
        updatedAt: dateToUTC(new Date())
      }
    )
    return this.handleMultiItemSuccess(
      this.typenames.multi,
      await PatchNotes.find()
    )
  }
  async delete({ id }) {
    const note = await PatchNotes.findById(id)
    if (note == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError()
    }

    await PatchNotes.findOneAndDelete(id)
    return this.handleMultiItemSuccess(
      this.typenames.multi,
      await PatchNotes.find()
    )
  }
  async publish({ id, ...rest }) {
    const note = await PatchNotes.findById(id)
    if (note == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError()
    }
    this.buildPayload({ ...rest }, note)
    const { dateToUTC } = this.formatters.date
    await PatchNotes.findByIdAndUpdate(
      { _id: id },
      {
        ...this.payload,
        updatedAt: dateToUTC(new Date())
      }
    )
    return this.handleMultiItemSuccess(
      this.typenames.multi,
      await PatchNotes.find()
    )
  }
}

export default PatchNotesController
