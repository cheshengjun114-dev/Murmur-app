const KOREA_TIME_ZONE = 'Asia/Seoul';
const TIME_ZONE_SUFFIX_PATTERN = /(Z|[+-]\d{2}:\d{2})$/;

function parseBackendDateTime(value) {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value !== 'string') {
    return new Date(value);
  }

  // The backend stores LocalDateTime values in UTC, but JSON has no timezone suffix.
  // Treat timezone-less API values as UTC so the browser can display Korea time correctly.
  return new Date(TIME_ZONE_SUFFIX_PATTERN.test(value) ? value : `${value}Z`);
}

export function formatDateTime(value) {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: KOREA_TIME_ZONE,
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parseBackendDateTime(value));
}
