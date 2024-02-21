import FaqController from './faqController.js'
const controller = new FaqController()

const Queries = {
  async getFaqs() {
    try {
      return await controller.getAll()
    } catch (error) {
      controller.catchError('fetching all FAQs')
    }
  },
  async getFaqById(_, payload) {
    try {
      return await controller.getById(payload)
    } catch (error) {
      controller.catchError('fetching FAQ')
    }
  }
}

const Mutations = {
  async createFaq(_, payload) {
    try {
      return await controller.create(payload)
    } catch (error) {
      controller.catchError('creating FAQ')
    }
  },
  async editFaq(_, payload) {
    try {
      return await controller.edit(payload)
    } catch (error) {
      controller.catchError('editing FAQ')
    }
  },
  async deleteFaq(_, payload) {
    try {
      return await controller.delete(payload)
    } catch (error) {
      controller.catchError('deleting FAQ')
    }
  }
}

export default { Queries, Mutations }
