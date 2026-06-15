/**
 * Connector system for linking multiple calendar instances together.
 * When one calendar navigates, all connected calendars navigate in sync.
 */

export interface ConnectorState {
  /** Shared displayed month across all connected calendars */
  displayedMonthDate: Date;
  /** Optional shared range selection */
  startDate: Date | null;
  endDate: Date | null;
}

/** Callback fired when connector state changes */
export type ConnectorChangeListener = (state: ConnectorState) => void;

/**
 * A connector group that synchronizes multiple calendar instances.
 * Calendars register themselves and receive navigation events from each other.
 */
export class CalendarConnector {
  private id: string;
  private state: ConnectorState;
  private listeners: Set<ConnectorChangeListener> = new Set();

  constructor(id: string, initialState?: Partial<ConnectorState>) {
    this.id = id;
    this.state = {
      displayedMonthDate: new Date(),
      startDate: null,
      endDate: null,
      ...initialState,
    };
  }

  /** Get the connector ID */
  public getId(): string {
    return this.id;
  }

  /** Get current state (read-only copy) */
  public getState(): ConnectorState {
    return { ...this.state };
  }

  /** Subscribe to state changes */
  public subscribe(listener: ConnectorChangeListener): () => void {
    this.listeners.add(listener);
    listener(this.getState()); // Initial call with current state
    return () => this.listeners.delete(listener);
  }

  private emit() {
    this.listeners.forEach((cb) => cb(this.getState()));
  }

  /** Navigate all connected calendars to a new month */
  public setDisplayedMonth(date: Date) {
    this.state.displayedMonthDate = date;
    this.emit();
  }

  /** Navigate forward one month */
  public nextMonth() {
    const d = new Date(this.state.displayedMonthDate);
    d.setMonth(d.getMonth() + 1);
    this.state.displayedMonthDate = d;
    this.emit();
  }

  /** Navigate backward one month */
  public prevMonth() {
    const d = new Date(this.state.displayedMonthDate);
    d.setMonth(d.getMonth() - 1);
    this.state.displayedMonthDate = d;
    this.emit();
  }

  /** Set a range selection across connected calendars */
  public setRange(start: Date, end: Date) {
    this.state.startDate = start;
    this.state.endDate = end;
    this.emit();
  }

  /** Clear the range selection */
  public clearRange() {
    this.state.startDate = null;
    this.state.endDate = null;
    this.emit();
  }

  /** Check if a date is within the current range */
  public isInRange(date: Date): boolean {
    if (!this.state.startDate || !this.state.endDate) return false;
    const time = date.getTime();
    return time >= this.state.startDate!.getTime() && time <= this.state.endDate!.getTime();
  }

  /** Check if a date is the start of the range */
  public isStartDate(date: Date): boolean {
    return (
      this.state.startDate !== null &&
      date.getFullYear() === this.state.startDate.getFullYear() &&
      date.getMonth() === this.state.startDate.getMonth() &&
      date.getDate() === this.state.startDate.getDate()
    );
  }

  /** Check if a date is the end of the range */
  public isEndDate(date: Date): boolean {
    return (
      this.state.endDate !== null &&
      date.getFullYear() === this.state.endDate.getFullYear() &&
      date.getMonth() === this.state.endDate.getMonth() &&
      date.getDate() === this.state.endDate.getDate()
    );
  }
}

/** Global registry of connectors by ID */
const connectorRegistry = new Map<string, CalendarConnector>();

/**
 * Get or create a connector group by ID.
 * Multiple calendars with the same connectorId will share state.
 */
export function getConnector(id: string): CalendarConnector {
  if (!connectorRegistry.has(id)) {
    connectorRegistry.set(id, new CalendarConnector(id));
  }
  return connectorRegistry.get(id)!;
}

/** Remove a connector from the registry (cleanup) */
export function removeConnector(id: string): void {
  connectorRegistry.delete(id);
}
