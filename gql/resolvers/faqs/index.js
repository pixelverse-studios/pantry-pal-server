import FaqController from './faqController.js'
const controller = new FaqController()

const Queries = {
  async getFaqs() {
    try {
      return await controller.getFaqs()
    } catch (error) {
      controller.catchError('fetching all FAQs')
    }
  },
  async getFaqById(_, payload) {
    try {
      return await controller.getFaqById(payload)
    } catch (error) {
      controller.catchError('fetching FAQ')
    }
  }
}

const Mutations = {
  async createFaq(_, payload) {
    try {
      return await controller.createFaq(payload)
    } catch (error) {
      controller.catchError('creating FAQ')
    }
  },
  async editFaq(_, payload) {
    try {
      return await controller.editFaq(payload)
    } catch (error) {
      controller.catchError('editing FAQ')
    }
  },
  async deleteFaq(_, payload) {
    try {
      return await controller.deleteFaq(payload)
    } catch (error) {
      controller.catchError('deleting FAQ')
    }
  }
}

export default { Queries, Mutations }
