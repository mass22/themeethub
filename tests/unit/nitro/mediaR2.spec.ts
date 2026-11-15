import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDataSource } from '../../../server/utils/dataSource'
import { getR2PublicUrl, extractKeyFromUrl, uploadToR2, deleteFromR2, listR2Objects } from '../../../server/utils/r2'

// Mock de useRuntimeConfig
global.useRuntimeConfig = vi.fn(() => ({
  useMocks: true,
  r2: {
    accountId: '',
    accessKeyId: '',
    secretAccessKey: '',
    bucketName: 'themeethub-test',
    publicUrl: 'https://media.themeethub.test',
    endpoint: ''
  }
}))

describe('Media & R2 integration in DataSource', () => {
  let ds: ReturnType<typeof useDataSource>

  beforeEach(() => {
    process.env.NUXT_USE_MOCKS = 'true'
    ds = useDataSource()
  })

  it('updates event with talks and slide support', async () => {
    const event = await ds.createEvent({
      title: 'Meetup Vue Media',
      date: '2026-11-20T19:00:00Z',
      slug: 'meetup-vue-media',
      speakers: []
    })

    const updated = await ds.updateEvent(event.id, {
      talks: [
        {
          id: 'talk_test_1',
          title: 'Architecture Vue 3',
          slug: 'architecture-vue-3',
          speakerId: 'spk_001',
          description: 'Deep dive Vue 3',
          slides: {
            type: 'file',
            fileUrl: 'https://media.themeethub.test/events/evt_test/slides/architecture-vue-3.pdf',
            fileName: 'architecture-vue-3.pdf',
            fileSize: 4200000
          }
        }
      ]
    })

    expect(updated?.talks).toBeDefined()
    expect(updated?.talks?.length).toBe(1)
    expect(updated?.talks?.[0].title).toBe('Architecture Vue 3')
    expect(updated?.talks?.[0].slides?.type).toBe('file')
    expect(updated?.talks?.[0].slides?.fileName).toBe('architecture-vue-3.pdf')
  })

  it('manages event photos: add, reorder, cover, and delete', async () => {
    const event = await ds.createEvent({
      title: 'Gallery Event Test',
      date: '2026-11-20T19:00:00Z',
      slug: 'gallery-test',
      speakers: []
    })

    // 1. Add photo 1
    const p1 = await ds.addEventPhoto(event.id, {
      thumbUrl: 'https://media.themeethub.test/events/evt_test/photos/thumb/photo1.webp',
      fullUrl: 'https://media.themeethub.test/events/evt_test/photos/full/photo1.webp',
      caption: 'Photo 1',
      order: 0,
      isCover: true
    })
    expect(p1.id).toMatch(/^pho_/)
    expect(p1.isCover).toBe(true)

    // 2. Add photo 2
    const p2 = await ds.addEventPhoto(event.id, {
      thumbUrl: 'https://media.themeethub.test/events/evt_test/photos/thumb/photo2.webp',
      fullUrl: 'https://media.themeethub.test/events/evt_test/photos/full/photo2.webp',
      caption: 'Photo 2',
      order: 1,
      isCover: false
    })
    expect(p2.order).toBe(1)

    // 3. List photos
    let list = await ds.getEventPhotos(event.id)
    expect(list.length).toBe(2)

    // 4. Set photo 2 as cover
    const coverRes = await ds.setEventCoverPhoto(event.id, p2.id)
    expect(coverRes?.isCover).toBe(true)

    list = await ds.getEventPhotos(event.id)
    const photo1 = list.find((p) => p.id === p1.id)
    const photo2 = list.find((p) => p.id === p2.id)
    expect(photo1?.isCover).toBe(false)
    expect(photo2?.isCover).toBe(true)

    // 5. Reorder photos
    const reordered = await ds.reorderEventPhotos(event.id, [p2.id, p1.id])
    expect(reordered[0].id).toBe(p2.id)
    expect(reordered[0].order).toBe(0)
    expect(reordered[1].id).toBe(p1.id)
    expect(reordered[1].order).toBe(1)

    // 6. Delete photo
    const deleted = await ds.deleteEventPhoto(event.id, p1.id)
    expect(deleted).toBe(true)

    list = await ds.getEventPhotos(event.id)
    expect(list.length).toBe(1)
    expect(list[0].id).toBe(p2.id)
  })

  it('correctly builds and parses R2 URLs and keys', () => {
    const key = 'events/evt_2026_11/photos/thumb/1731618000-photo1.webp'
    const url = getR2PublicUrl(key)
    expect(url).toBe('https://media.themeethub.test/events/evt_2026_11/photos/thumb/1731618000-photo1.webp')

    const extracted = extractKeyFromUrl(url)
    expect(extracted).toBe(key)
  })

  it('uploads to local fallback when R2 credentials are not configured', async () => {
    const key = 'events/evt_test/slides/architecture-vue.pdf'
    const dummyBuffer = Buffer.from('PDF content mock')
    const result = await uploadToR2({
      key,
      body: dummyBuffer,
      contentType: 'application/pdf'
    })

    expect(result.key).toBe(key)
    expect(result.url).toContain('events/evt_test/slides/architecture-vue.pdf')

    // Clean up
    await deleteFromR2(key)
  })

  it('lists R2 objects or fallback correctly', async () => {
    const list = await listR2Objects('events/evt_001/photos/thumb/')
    expect(Array.isArray(list)).toBe(true)
  })
})
