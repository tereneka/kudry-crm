function classByCondition(
  className: string,
  condition: boolean,
  modifier?: string
) {
  return `${className} ${
    condition ? className + '_' + modifier : ''
  }`;
}

export { classByCondition };
