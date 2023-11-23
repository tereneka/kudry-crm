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

function phoneFormat(phone: string) {
  return (
    phone.slice(0, 2) +
    '(' +
    phone.slice(2, 5) +
    ')' +
    phone.slice(5, 8) +
    '-' +
    phone.slice(7, 9) +
    '-' +
    phone.slice(10)
  );
}

const disableIosTextFieldZoom = () => {
  const isIOS = /iPad|iPhone|iPod/.test(
    navigator.userAgent
  );
  if (isIOS) {
    const element = document.querySelector(
      'meta[name=viewport]'
    );

    if (element !== null) {
      let content =
        element.getAttribute('content');
      const regexp = /maximum\-scale=[0-9\.]+/g;

      if (content && regexp.test(content)) {
        content = content.replace(
          regexp,
          'maximum-scale=1.0'
        );
      } else {
        content = [
          content,
          'maximum-scale=1.0',
        ].join(', ');
      }

      element.setAttribute('content', content);
    }
  }
};

export {
  plural,
  numberFormat,
  phoneFormat,
  disableIosTextFieldZoom,
};
