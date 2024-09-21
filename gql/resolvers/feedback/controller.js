import BaseResolver from '../../baseResolver.js'
import Feedback from '../../../models/Feedback.js'
import { logError, logInfo, Topic, Command } from '../../../utils/logger.js'

class FeedbackController extends BaseResolver {
  constructor() {
    super()
    this.typenames = {
      single: 'Feedback',
      multi: 'Feedbacks'
    }
  }

  catchError(action, { topic, operation }, error) {
    logError(topic, operation, error)
    this.catchError(action)
  }

  async getAll() {
    const all = await Feedback.find().populate('user').sort({ createdAt: -1 })
    return this.handleMultiItemSuccess(all)
  }

  async get({ id }, ctx) {
    const item = await Feedback.findById(id).populate('user')
    if (item == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError(
        Topic.Feedback,
        ctx.operation,
        'Feedback item not found'
      )
    }
    return this.handleSingleItemSuccess(item)
  }

  async create({ userId, payload }) {
    const newFeedback = new Feedback({
      user: userId, // Reference to the user
      ...payload,
      updatedAt: new Date()
    })

    const saved = await newFeedback.save()
    return this.handleSingleItemSuccess(saved)
  }

  async edit({ id, status }, ctx) {
    const existing = await Feedback.findById(id)
    if (existing == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError(
        Topic.Feedback,
        ctx.operation,
        'Feedback item not found'
      )
    }

    await Feedback.findByIdAndUpdate(id, { acked: status }, { new: true })
    const allItems = await Feedback.find().populate(
      'user',
      'firstName lastName email'
    )
    return this.handleMultiItemSuccess(allItems)
  }

  async delete({ id }, ctx) {
    logInfo(Topic.Feedback, ctx.operation, `${Command.Delete} ${id}`)
    const result = await Feedback.findByIdAndDelete(id)
    const { string } = this.validations
    const success = string.isMatching(result._id, id)
    return success
  }
}

export default FeedbackController
