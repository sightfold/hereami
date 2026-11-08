type WithId = { id: string };

export const replaceById = <T extends WithId>(list: T[], item: T) =>
  list.map((entry) => (entry.id === item.id ? item : entry));

export const upsertById = <T extends WithId>(list: T[], item: T) =>
  list.some((entry) => entry.id === item.id) ? replaceById(list, item) : [...list, item];

export const removeById = <T extends WithId>(list: T[], id: string) =>
  list.filter((entry) => entry.id !== id);
