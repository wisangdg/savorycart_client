import { formatPrice, formatDate } from '../../utils/formatters';

describe('formatPrice', () => {
  test('formats integer price correctly', () => {
    expect(formatPrice(1000)).toBe('1.000');
    expect(formatPrice(1000000)).toBe('1.000.000');
  });

  test('formats decimal price correctly', () => {
    expect(formatPrice(1000.5)).toBe('1.001');
    expect(formatPrice(1000.4)).toBe('1.000');
  });

  test('formats zero correctly', () => {
    expect(formatPrice(0)).toBe('0');
  });

  test('handles negative numbers', () => {
    expect(formatPrice(-1000)).toBe('-1.000');
  });
});

describe('formatDate', () => {
  // Mock the toLocaleDateString method to return a predictable value
  const originalToLocaleDateString = Date.prototype.toLocaleDateString;
  
  beforeEach(() => {
    Date.prototype.toLocaleDateString = vi.fn(() => '1 Januari 2023, 10:30');
  });
  
  afterEach(() => {
    Date.prototype.toLocaleDateString = originalToLocaleDateString;
  });

  test('formats date string correctly', () => {
    expect(formatDate('2023-01-01T10:30:00')).toBe('1 Januari 2023, 10:30');
  });

  test('handles different date formats', () => {
    expect(formatDate('2023/01/01')).toBe('1 Januari 2023, 10:30');
    expect(formatDate('January 1, 2023')).toBe('1 Januari 2023, 10:30');
  });
});
