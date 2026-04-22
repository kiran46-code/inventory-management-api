const toNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toBoolean = (value) => {
  if (value === undefined) {
    return undefined;
  }

  return ['true', '1', 'yes'].includes(String(value).toLowerCase());
};

const toArray = (value) => {
  if (!value) {
    return [];
  }

  return String(value)
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
};

module.exports = { toNumber, toBoolean, toArray };
