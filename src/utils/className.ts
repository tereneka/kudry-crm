function classByCondition(
  className: string,
  modifier: string,
  condition: boolean
) {
  return `${className} ${
    condition ? className + '_' + modifier : ''
  }`;
}

export { classByCondition };
