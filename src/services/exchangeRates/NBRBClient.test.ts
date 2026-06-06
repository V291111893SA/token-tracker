import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { needsRefresh } from './NBRBClient'

describe('needsRefresh', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns true when fetchedAt is undefined', () => {
    vi.setSystemTime(new Date('2026-06-06T15:30:00'))
    expect(needsRefresh(undefined)).toBe(true)
  })

  it('returns true when fetchedAt is before current slot start (afternoon)', () => {
    // Current local time: 15:30 (3:30 PM)
    // Current slot start: 12:00 (noon)
    vi.setSystemTime(new Date('2026-06-06T15:30:00'))

    // This timestamp is from before the current slot, so should refresh
    const oldFetchedAt = new Date('2026-06-06T11:00:00').toISOString()
    expect(needsRefresh(oldFetchedAt)).toBe(true)
  })

  it('returns false when fetchedAt is after current slot start (afternoon)', () => {
    // Current local time: 15:30 (3:30 PM)
    // Current slot start: 12:00 (noon)
    vi.setSystemTime(new Date('2026-06-06T15:30:00'))

    // This timestamp is after the current slot start, so should not refresh
    const recentFetchedAt = new Date('2026-06-06T13:00:00').toISOString()
    expect(needsRefresh(recentFetchedAt)).toBe(false)
  })

  it('returns true when rates were fetched yesterday (before current slot)', () => {
    // Current local time: 15:30 (3:30 PM)
    vi.setSystemTime(new Date('2026-06-06T15:30:00'))

    // Yesterday, even if late afternoon - definitely before current slot
    const yesterdayFetchedAt = new Date('2026-06-05T20:00:00').toISOString()
    expect(needsRefresh(yesterdayFetchedAt)).toBe(true)
  })

  it('returns false when rates were fetched at exactly the current slot start', () => {
    // Current local time: 15:30 (3:30 PM)
    // Current slot start: 12:00 (noon)
    vi.setSystemTime(new Date('2026-06-06T15:30:00'))

    // Exactly at the current slot start
    const exactSlotStart = new Date('2026-06-06T12:00:00').toISOString()
    expect(needsRefresh(exactSlotStart)).toBe(false)
  })

  it('works correctly before noon', () => {
    // Current local time: 09:00 (9:00 AM)
    // Current slot start: 00:00 (midnight)
    vi.setSystemTime(new Date('2026-06-06T09:00:00'))

    // Yesterday, definitely before current slot
    const yesterdayFetchedAt = new Date('2026-06-05T20:00:00').toISOString()
    expect(needsRefresh(yesterdayFetchedAt)).toBe(true)

    // After current slot start (00:00), so should not refresh
    const todayMorningFetchedAt = new Date('2026-06-06T08:00:00').toISOString()
    expect(needsRefresh(todayMorningFetchedAt)).toBe(false)
  })
})
