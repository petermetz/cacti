export const DurationNano = {
  /**
   * Duration of one nanosecond.
   * 10e9 of this is one second.
   */
  Nanosecond: 1n,

  /**
   * Duration of one microsecond.
   * Can be divided up to 1000 nanoseconds.
   * 10e6 of this is one second.
   */
  Microsecond: 1000n,

  /**
   * Duration of one millisecond.
   * Can be divided up to 1000 microseconds.
   * 10e3 of this is one second.
   */
  Millisecond: 1_000_000n,

  /**
   * Duration of one second.
   * Can be divided up to 1000 milliseconds.
   */
  Second: 1_000_000_000n,

  /**
   * Duration of one minute.
   */
  Minute: 60n * 1_000_000_000n,

  /**
   * Duration of one hour.
   */
  Hour: 60n * 60n * 1_000_000_000n,
} as const;

export type DurationNano = (typeof DurationNano)[keyof typeof DurationNano];
