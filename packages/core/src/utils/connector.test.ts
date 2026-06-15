import { describe, it, expect, beforeEach } from 'vitest';
import { getConnector, removeConnector } from './connector';

beforeEach(() => {
  try { removeConnector('test'); } catch {}
  try { removeConnector('reg-test'); } catch {}
});

describe('getConnector', () => {
  it('creates a new connector on first call', () => {
    const conn = getConnector('test');
    expect(conn).toBeDefined();
  });

  it('returns same instance for same id', () => {
    const a = getConnector('reg-test');
    const b = getConnector('reg-test');
    expect(a).toBe(b);
  });

  it('default state has null dates', () => {
    const conn = getConnector('test');
    const state = conn.getState();
    expect(state.startDate).toBeNull();
    expect(state.endDate).toBeNull();
  });
});

describe('connector methods', () => {
  let conn: ReturnType<typeof getConnector>;
  beforeEach(() => { conn = getConnector('methods-test'); });

  it('setRange updates state and notifies subscribers', () => {
    const start = new Date(2024, 5, 1);
    const end = new Date(2024, 5, 15);
    let callCount = 0;
    conn.subscribe(() => { callCount++; });
    expect(callCount).toBe(1); // subscribe fires immediately
    conn.setRange(start, end);
    expect(callCount).toBe(2); // + emit from setRange
    expect(conn.getState().startDate).toEqual(start);
    expect(conn.getState().endDate).toEqual(end);
  });

  it('clearRange resets both dates', () => {
    conn.setRange(new Date(), new Date());
    conn.clearRange();
    expect(conn.getState().startDate).toBeNull();
    expect(conn.getState().endDate).toBeNull();
  });

  it('unsubscribe stops notifications', () => {
    let count = 0;
    const unsub = conn.subscribe(() => { count++; });
    expect(count).toBe(1); // initial call from subscribe
    unsub();
    conn.setRange(new Date(), new Date());
    expect(count).toBe(1); // no more notifications
  });

  it('setDisplayedMonth notifies subscribers', () => {
    let notified = false;
    conn.subscribe(() => { notified = true; });
    const month = new Date(2024, 5, 1);
    conn.setDisplayedMonth(month);
    expect(notified).toBe(true);
    expect(conn.getState().displayedMonthDate).toEqual(month);
  });
});

describe('removeConnector', () => {
  it('removes connector from registry', () => {
    getConnector('a');
    removeConnector('a');
    const fresh = getConnector('a');
    expect(fresh).toBeDefined();
  });
});
