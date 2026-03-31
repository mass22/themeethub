import { deleteEntity, isDeletableResource } from '~~/server/utils/deleteEntity'

export default defineEventHandler(async (event) => {
  const resource = getRouterParam(event, 'resource')
  const id = getRouterParam(event, 'id')

  if (!resource || !isDeletableResource(resource)) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported resource' })
  }
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const deleted = await deleteEntity(resource, id)
  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: 'Item not found or cannot be deleted' })
  }

  return { ok: true }
})
