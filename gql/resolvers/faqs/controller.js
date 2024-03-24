import BaseResolver from '../../baseResolver.js'
import FAQs from '../../../models/FAQs.js'
import { Command, Topic, logError, logInfo } from '../../../utils/logger.js'

class FaqController extends BaseResolver {
  constructor() {
    super()
    this.addedErrors = {}
    this.errors = { ...this.errors, ...this.addedErrors }
    this.typenames = {
      single: 'Faq',
      multi: 'Faqs'
    }
  }

  catchError(action, { topic, operation }, error) {
    logError(topic, operation, error)
    return this.catchError(action)
  }
  async getAll(ctx) {
    const allFaqs = await FAQs.find()
    if (allFaqs?.length == 0) {
      this.error = this.errors.notFound(this.typenames.multi)
      return this.handleError(Topic.Faqs, ctx.operation, 'System has no FAQs')
    }
    return this.handleMultiItemSuccess(allFaqs)
  }
  async getById({ id }, ctx) {
    const faq = await FAQs.findById(id)
    if (faq == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError(Topic.Faqs, ctx.operation, `Could not find ${id}`)
    }

    return this.handleSingleItemSuccess(faq)
  }
  async create({ question, answer }, ctx) {
    const faq = await FAQs.findOne({ question })
    if (faq !== null) {
      this.error = this.errors.duplicate(this.typenames.single)
      return this.handleError(
        Topic.Faqs,
        ctx.operation,
        `Duplicate FAQ: ${question} | ${answer}`
      )
    }
    const newFaq = new FAQs({ question, answer, updatedAt: Date.now() })
    await newFaq.save()
    const allFaqs = await FAQs.find()
    return this.handleMultiItemSuccess(allFaqs)
  }
  async edit({ id, question, answer }, ctx) {
    const faq = await FAQs.findById(id)
    if (faq == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError(
        Topic.Faqs,
        ctx.operation,
        `Could not find ID ${id}`
      )
    }

    await FAQs.findOneAndUpdate(
      { _id: id },
      { question, answer, updatedAt: Date.now() }
    )
    return this.handleMultiItemSuccess(await FAQs.find())
  }
  async delete({ id }, ctx) {
    logInfo(Topic.Faqs, ctx.operation, `${Command.Delete} ${id}`)
    await FAQs.findOneAndDelete(id)
    return this.handleMultiItemSuccess(await FAQs.find())
  }
}

export default FaqController
