interface Variants {
  one?: string;
  few?: string;
  many?: string;
  other?: string;
  zero?: string;
  two?: string;
}

function plural(
  value: number,
  variants: Variants = {},
  locale: string = 'ru-RU'
) {
  // Получаем фурму кодовой строкой: 'zero', 'one', 'two', 'few', 'many', 'other'
  // В русском языке 3 формы: 'one', 'few', 'many', и 'other' для дробных
  // В английском 2 формы: 'one', 'other'
  const key = new Intl.PluralRules(locale).select(
    value
  );
  // Возвращаем вариант по ключу, если он есть
  return variants[key] || '';
}

function numberFormat(
  value: number,
  locale = 'ru-RU',
  options = {}
) {
  return new Intl.NumberFormat(
    locale,
    options
  ).format(value);
}

export { plural, numberFormat };
