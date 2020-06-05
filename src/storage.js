const KeyPrefix = "__sprintGraph__";

export function set(key, value) {
  localStorage.setItem(KeyPrefix + key, JSON.stringify(value));
}

export function get(key, { defaultValue = null } = {}) {
  const value = localStorage.getItem(KeyPrefix + key);
  return value ? JSON.parse(value) : defaultValue;
}
