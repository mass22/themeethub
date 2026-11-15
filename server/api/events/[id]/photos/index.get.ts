export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'id')!
  const ds = useDataSource()
  const foundEvent = await ds.getEvent(eventId)
  if (!foundEvent) {
    throw createError({ statusCode: 404, statusMessage: 'Event not found' })
  }

  const photos = await ds.getEventPhotos(eventId)
  return photos
})
