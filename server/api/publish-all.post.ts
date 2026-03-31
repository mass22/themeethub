export default defineEventHandler(async () => {
  const ds = useDataSource()
  const publishedAt = new Date().toISOString()

  const [events, speakers, sponsors] = await Promise.all([
    ds.listEvents(),
    ds.listSpeakers(),
    ds.listSponsors()
  ])

  await Promise.all([
    ...events.map((event) => ds.updateEvent(event.id, { publishedAt })),
    ...speakers.map((speaker) => ds.updateSpeaker(speaker.id, { publishedAt })),
    ...sponsors.map((sponsor) => ds.updateSponsor(sponsor.id, { publishedAt }))
  ])

  return {
    ok: true,
    publishedAt,
    counts: {
      events: events.length,
      speakers: speakers.length,
      sponsors: sponsors.length
    }
  }
})
