import BaseResolver from '../../baseResolver.js'
import FAQs from '../../../models/FAQs.js'

class FaqResolver extends BaseResolver {
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
  async getFaqs() {
    const allFaqs = await FAQs.find()
    if (allFaqs?.length == 0) {
      this.error = this.errors.notFound(this.typenames.multi)
      return this.handleError()
    }
    return this.handleMultiItemSuccess(this.typenames.multi, allFaqs)
  }
  async getFaqById({ id }) {
    const faq = await FAQs.findById(id)
    if (faq == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError()
    }

    return this.handleSingleItemSuccess(faq)
  }
  async createFaq({ question, answer }) {
    const faq = await FAQs.findOne({ question })
    if (faq !== null) {
      this.error = this.errors.duplicateItem(this.typenames.single)
      return this.handleError()
    }
    const newFaq = new FAQs({ question, answer, updatedAt: new Date() })
    await newFaq.save()
    const allFaqs = await FAQs.find()
    this.typename = this.typenames.multi
    return this.handleMultiItemSuccess(this.typenames.multi, allFaqs)
  }
  async editFaq({ id, question, answer }) {
    const faq = await FAQs.findById(id)
    if (faq == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError()
    }

    await FAQs.findOneAndUpdate(
      { _id: id },
      { question, answer, updatedAt: new Date() }
    )
    return this.handleMultiItemSuccess(this.typenames.multi, await FAQs.find())
  }
  async deleteFaq({ id }) {
    await FAQs.findOneAndDelete(id)
    this.typename = this.typenames.multi
    return this.handleMultiItemSuccess(this.typenames.multi, await FAQs.find())
  }
}

export default FaqResolver
