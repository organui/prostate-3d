import { describe, expect, test } from 'bun:test'
import { emphasis, structures } from '../src/anatomy'

describe('selection emphasis', () => {
  test('keeps every structure normal without a selection', () => {
    expect(structures.every((s) => emphasis(s.id, null) === 'normal')).toBe(true)
  })

  test('keeps the selection solid and ghosts everything else', () => {
    const states = structures.map((s) => emphasis(s.id, 'urethra'))
    expect(states.filter((s) => s === 'selected')).toHaveLength(1)
    expect(emphasis('urethra', 'urethra')).toBe('selected')
    expect(emphasis('prostate', 'urethra')).toBe('ghosted')
  })
})

describe('source ownership', () => {
  test('assigns every source element to exactly one structure', () => {
    const elements = structures.flatMap((s) => s.elements)
    expect(new Set(elements).size).toBe(elements.length)
  })
})
