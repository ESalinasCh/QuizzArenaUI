import { StatusVariantPipe } from './status-variant.pipe';

describe('StatusVariantPipe', () => {
  let pipe: StatusVariantPipe;

  beforeEach(() => {
    pipe = new StatusVariantPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should map active to success', () => {
    expect(pipe.transform('Active')).toBe('success');
    expect(pipe.transform('active')).toBe('success');
  });

  it('should map pending to warning', () => {
    expect(pipe.transform('Pending')).toBe('warning');
    expect(pipe.transform('pending')).toBe('warning');
  });

  it('should map expired or finished to danger', () => {
    expect(pipe.transform('Expired')).toBe('danger');
    expect(pipe.transform('finished')).toBe('danger');
  });

  it('should fallback to info for unknown or null status', () => {
    expect(pipe.transform(null)).toBe('info');
    expect(pipe.transform(undefined)).toBe('info');
    expect(pipe.transform('other')).toBe('info');
  });
});
