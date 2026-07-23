import { HttpParams } from '@angular/common/http';
import { buildHttpParams } from './api-url.util';

describe('buildHttpParams', () => {

  it('returns empty HttpParams when no argument is passed', () => {
    const result = buildHttpParams();
    expect(result.keys().length).toBe(0);
  });

  it('returns empty HttpParams when object is undefined', () => {
    const result = buildHttpParams(undefined);
    expect(result.keys().length).toBe(0);
  });

  it('appends a string value', () => {
    const result = buildHttpParams({ search: 'math' });
    expect(result.get('search')).toBe('math');
  });

  it('appends a numeric value as string', () => {
    const result = buildHttpParams({ page: 2 });
    expect(result.get('page')).toBe('2');
  });

  it('skips null values', () => {
    const result = buildHttpParams({ filter: null });
    expect(result.has('filter')).toBe(false);
  });

  it('skips undefined values', () => {
    const result = buildHttpParams({ filter: undefined });
    expect(result.has('filter')).toBe(false);
  });

  it('skips empty string values', () => {
    const result = buildHttpParams({ search: '' });
    expect(result.has('search')).toBe(false);
  });

  it('appends multiple values for an array key', () => {
    const result = buildHttpParams({ ids: ['a', 'b', 'c'] });
    expect(result.getAll('ids')).toEqual(['a', 'b', 'c']);
  });

  it('skips null items inside an array', () => {
    const result = buildHttpParams({ ids: [null, 'valid', undefined] });
    expect(result.getAll('ids')).toEqual(['valid']);
  });

  it('handles multiple keys at once', () => {
    const result = buildHttpParams({ page: 1, pageSize: 6, search: 'hello' });
    expect(result.get('page')).toBe('1');
    expect(result.get('pageSize')).toBe('6');
    expect(result.get('search')).toBe('hello');
  });

  it('returns a HttpParams instance', () => {
    expect(buildHttpParams({ x: 1 }) instanceof HttpParams).toBe(true);
  });
});
