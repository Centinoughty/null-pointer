module.exports.parseExpiry = (expiry) => {
  const match = expiry.match(/^(\d+)([h|d|m])$/);
  if (!match) return 0;
  const [_, value, unit] = match;
  return unit === "h"
    ? value * 60 * 60 * 1000
    : unit === "d"
    ? value * 24 * 60 * 60 * 1000
    : unit === "m"
    ? value * 60 * 1000
    : 0;
};
