export type Dictionary = typeof import('../dictionaries/tr.json');

export const dictionaries = {
  tr: () => import('../dictionaries/tr.json').then((module) => module.default),
  en: () => import('../dictionaries/en.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'tr' | 'en') => {
  return dictionaries[locale]();
};
