import BaseResolver from '../../baseResolver.js'
import FAQs from '../../../models/FAQs.js'

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

  catchError(action) {
    return this.catchError(action)
  }
  async getAll() {
    const allFaqs = await FAQs.find()
    if (allFaqs?.length == 0) {
      this.error = this.errors.notFound(this.typenames.multi)
      return this.handleError()
    }
    return this.handleMultiItemSuccess(allFaqs)
  }
  async getById({ id }) {
    const faq = await FAQs.findById(id)
    if (faq == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError()
    }

    return this.handleSingleItemSuccess(faq)
  }
  async create({ question, answer }) {
    const faq = await FAQs.findOne({ question })
    if (faq !== null) {
      this.error = this.errors.duplicateItem(this.typenames.single)
      return this.handleError()
    }
    const newFaq = new FAQs({ question, answer, updatedAt: new Date() })
    await newFaq.save()
    const allFaqs = await FAQs.find()
    return this.handleMultiItemSuccess(allFaqs)
  }
  async edit({ id, question, answer }) {
    const faq = await FAQs.findById(id)
    if (faq == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError()
    }

    await FAQs.findOneAndUpdate(
      { _id: id },
      { question, answer, updatedAt: new Date() }
    )
    return this.handleMultiItemSuccess(await FAQs.find())
  }
  async delete({ id }) {
    await FAQs.findOneAndDelete(id)
    return this.handleMultiItemSuccess(await FAQs.find())
  }
}

export default FaqController
