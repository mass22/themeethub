import events from '../../mocks/events.json'
import speakers from '../../mocks/speakers.json'
import type { Event } from '../../types/event'
import type { Speaker } from '../../types/speaker'

export function useDataSource() {
  const config = useRuntimeConfig()
  const useMocks = process.env.NUXT_USE_MOCKS === 'true' || config.useMocks

  return {
    useMocks,
    async listEvents(): Promise<Event[]> { return events as Event[] },
    async getEvent(id: string): Promise<Event | null> { return (events as Event[]).find((e: Event) => e.id === id) ?? null },
    async createEvent(payload: Omit<Event, 'id'>): Promise<Event> {
      if (!useMocks) throw new Error('DB not implemented yet')
      const id = `evt_${Math.random().toString(36).slice(2, 8)}`
      const e: Event = {
        id,
        stats: { registered: 0, attended: 0 },
        ...payload,
        speakers: payload.speakers || []
      }
      ;(events as Event[]).push(e)
      return e
    },
    async listSpeakers(): Promise<Speaker[]> { return speakers as Speaker[] },
    async createSpeaker(payload: Omit<Speaker, 'id'>): Promise<Speaker> {
      if (!useMocks) throw new Error('DB not implemented yet')
      const id = `spk_${Math.random().toString(36).slice(2, 8)}`
      const s: Speaker = { id, ...payload }
      ;(speakers as Speaker[]).push(s)
      return s
    }
  }
}