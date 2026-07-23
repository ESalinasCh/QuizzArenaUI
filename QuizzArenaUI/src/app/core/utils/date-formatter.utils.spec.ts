import { describe, it, expect } from 'vitest';
import { getLocalDatetimeString, formatLocalToOffsetIso } from './date-formatter.utils';

describe('date-formatter.utils', () => {
  describe('getLocalDatetimeString', () => {
    it('should format a date into YYYY-MM-DDTHH:mm string matching local time', () => {
      const testDate = new Date(2026, 6, 23, 14, 30); // 2026-07-23 14:30
      const formatted = getLocalDatetimeString(testDate);
      expect(formatted).toBe('2026-07-23T14:30');
    });
  });

  describe('formatLocalToOffsetIso', () => {
    it('should return empty string for falsy input', () => {
      expect(formatLocalToOffsetIso('')).toBe('');
    });

    it('should format valid local datetime string with timezone offset', () => {
      const formatted = formatLocalToOffsetIso('2026-07-23T14:30');
      expect(formatted).toMatch(/^2026-07-23T14:30:00[+-]\d{2}:\d{2}$/);
    });

    it('should handle string with seconds', () => {
      const formatted = formatLocalToOffsetIso('2026-07-23T14:30:00');
      expect(formatted).toMatch(/^2026-07-23T14:30:00[+-]\d{2}:\d{2}$/);
    });
  });
});
