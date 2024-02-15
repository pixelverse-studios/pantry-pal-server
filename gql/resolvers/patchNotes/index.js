import PatchNotesController from './patchNotesController.js'
const controller = new PatchNotesController()

const Queries = {
  async getAllPatchNotes() {
    try {
      return await controller.getAll()
    } catch (error) {
      controller.catchError('fetching Patch Notes')
    }
  }
}

const Mutations = {
  async createPatchNote(_, payload) {
    try {
      return await controller.create(payload)
    } catch (error) {
      controller.catchError('creating Patch Note')
    }
  },
  async editPatchNote(_, payload) {
    try {
      return await controller.edit(payload)
    } catch (error) {
      controller.catchError('editing Patch Note')
    }
  },
  async deletePatchNote(_, payload) {
    try {
      return await controller.delete(payload)
    } catch (error) {
      controller.catchError('deleting Patch Note')
    }
  },
  async publishPatchNote(_, payload) {
    try {
      return await controller.publish(payload)
    } catch (error) {
      controller.catchError('publishing Patch Note')
    }
  }
}

export default { Queries, Mutations }
