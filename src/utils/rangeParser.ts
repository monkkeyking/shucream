export const parseRange = (rangeStr: string) => {
  const match = rangeStr.match(/^(\d+)\.\.(=?)(\d+)$/);
  if (!match) {
    throw new Error(
      'Invalid range format. Expected "start..end" or "start..=end".',
    );
  }

  const start = parseInt(match[1], 10);
  const end = parseInt(match[3], 10);
  const includeEnd = match[2] === '=';

  const range = [];
  for (let i = start; i < end + (includeEnd ? 1 : 0); i++) {
    range.push(i);
  }

  return range;
};
