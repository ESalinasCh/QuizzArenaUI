export function getLocalDatetimeString(date: Date = new Date()): string {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}

export function formatLocalToOffsetIso(localDatetimeStr: string): string {
  if (!localDatetimeStr) return '';
  const base = localDatetimeStr.length === 16 ? `${localDatetimeStr}:00` : localDatetimeStr;
  const date = new Date(base);
  if (isNaN(date.getTime())) return base;

  const offsetMinutes = date.getTimezoneOffset();
  const sign = offsetMinutes > 0 ? '-' : '+';
  const absOffset = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absOffset / 60)).padStart(2, '0');
  const minutes = String(absOffset % 60).padStart(2, '0');

  return `${base}${sign}${hours}:${minutes}`;
}
