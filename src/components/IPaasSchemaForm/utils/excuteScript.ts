export function excuteScriptByValidateRules(script: string, value: any): [boolean, string?] {
  return new Function(
    'value',
    `
    try {
      ${script}
      main(value)
      return [true]
    } catch (e) {
      return [false, e.message]
    }
  `,
  )(value);
}
