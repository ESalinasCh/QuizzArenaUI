import { describe, it, expect } from 'vitest';
import { getLocalDatetimeString, formatLocalToUtcIso, formatLocalToOffsetIso } from './date-formatter.utils';

describe('date-formatter.utils', () => {
  describe('getLocalDatetimeString', () => {
    it('should format a date into YYYY-MM-DDTHH:mm string matching local time', () => {
      const testDate = new Date(2026, 6, 23, 14, 30);
      const formatted = getLocalDatetimeString(testDate);
      expect(formatted).toBe('2026-07-23T14:30');
    });
  });

  describe('formatLocalToUtcIso', () => {
    it('should return empty string for falsy input', () => {
      expect(formatLocalToUtcIso('')).toBe('');
    });

    it('should convert local datetime string to UTC ISO string ending in Z', () => {
      const formatted = formatLocalToUtcIso('2026-07-23T14:30');
      expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
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
  });
});
