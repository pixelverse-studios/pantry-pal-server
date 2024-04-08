import PatchNotesController from './controller.js'
import { Topic } from '../../../utils/logger.js'
const controller = new PatchNotesController()
const topic = Topic.PatchNotes

const Queries = {
  async getAllPatchNotes(_, __, ctx) {
    try {
      return await controller.getAll(ctx)
    } catch (error) {
      controller.catchError('fetching Patch Notes', {
        topic,
        operation: ctx.operation
      }),
        error
    }
  }
}

const Mutations = {
  async createPatchNote(_, payload, ctx) {
    try {
      return await controller.create(payload, ctx)
    } catch (error) {
      controller.catchError(
        'creating Patch Note',
        {
          topic,
          operation: ctx.operation
        },
        error
      )
    }
  },
  async editPatchNote(_, payload, ctx) {
    try {
      return await controller.edit(payload, ctx)
    } catch (error) {
      controller.catchError(
        'editing Patch Note',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async deletePatchNote(_, payload, ctx) {
    try {
      return await controller.delete(payload, ctx)
    } catch (error) {
      controller.catchError(
        'deleting Patch Note',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async publishPatchNote(_, payload, ctx) {
    try {
      return await controller.publish(payload, ctx)
    } catch (error) {
      controller.catchError(
        'publishing Patch Note',
        { topic, operation: ctx.operation },
        error
      )
    }
  }
}

export default { Queries, Mutations }
