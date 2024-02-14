import FaqResolver from './faqResolver.js'
const resolver = new FaqResolver()

const Queries = {
  async getFaqs() {
    try {
      return await resolver.getFaqs()
    } catch (error) {
      resolver.catchError('fetching all FAQs')
    }
  },
  async getFaqById(_, payload) {
    try {
      return await resolver.getFaqById(payload)
    } catch (error) {
      resolver.catchError('fetching FAQ')
    }
  }
}

const Mutations = {
  async createFaq(_, payload) {
    try {
      return await resolver.createFaq(payload)
    } catch (error) {
      resolver.catchError('creating FAQ')
    }
  },
  async editFaq(_, payload) {
    try {
      return await resolver.editFaq(payload)
    } catch (error) {
      resolver.catchError('editing FAQ')
    }
  },
  async deleteFaq(_, payload) {
    try {
      return await resolver.deleteFaq(payload)
    } catch (error) {
      resolver.catchError('deleting FAQ')
    }
  }
}

export default { Queries, Mutations }
