export const toTitle = (s) => String(s || '').replace(/\b\w/g, c => c.toUpperCase());
