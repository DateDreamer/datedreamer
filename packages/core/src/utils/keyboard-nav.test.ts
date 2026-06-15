import { describe, it, expect } from 'vitest';
import { handleDayKeyDown, findDayIndex } from './keyboard-nav';

function keyEvent(key: string) {
  return new KeyboardEvent('keydown', { key });
}

describe('handleDayKeyDown', () => {
  const date = new Date(2024, 5, 15); // June 15, Saturday

  it('ArrowRight moves +1 day', () => {
    const r = handleDayKeyDown(keyEvent('ArrowRight'), date);
    expect(r.preventDefault).toBe(true);
    expect(r.date!.getDate()).toBe(16);
  });

  it('ArrowLeft moves -1 day', () => {
    const r = handleDayKeyDown(keyEvent('ArrowLeft'), date);
    expect(r.date!.getDate()).toBe(14);
  });

  it('ArrowDown moves +7 days', () => {
    const r = handleDayKeyDown(keyEvent('ArrowDown'), date);
    expect(r.date!.getDate()).toBe(22);
  });

  it('ArrowUp moves -7 days', () => {
    const r = handleDayKeyDown(keyEvent('ArrowUp'), date);
    expect(r.date!.getDate()).toBe(8);
  });

  it('Home goes to Sunday of week', () => {
    const r = handleDayKeyDown(keyEvent('Home'), date);
    expect(r.date!.getDay()).toBe(0);
  });

  it('End goes to Saturday of week', () => {
    const r = handleDayKeyDown(keyEvent('End'), date);
    expect(r.date!.getDay()).toBe(6);
  });

  it('PageDown moves +1 month', () => {
    const r = handleDayKeyDown(keyEvent('PageDown'), date);
    expect(r.date!.getMonth()).toBe(6); // July
  });

  it('PageUp moves -1 month', () => {
    const r = handleDayKeyDown(keyEvent('PageUp'), date);
    expect(r.date!.getMonth()).toBe(4); // May
  });

  it('unknown key returns null date', () => {
    const r = handleDayKeyDown(keyEvent('F5'), date);
    expect(r.date).toBeNull();
    expect(r.preventDefault).toBe(false);
  });
});

describe('findDayIndex', () => {
  it('finds matching date index', () => {
    const days = [new Date(2024, 5, 1), new Date(2024, 5, 2)];
    expect(findDayIndex(new Date(2024, 5, 2), days)).toBe(1);
  });

  it('returns -1 for missing date', () => {
    const days = [new Date(2024, 5, 1)];
    expect(findDayIndex(new Date(2024, 5, 99), days)).toBe(-1);
  });
});
