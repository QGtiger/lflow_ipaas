export function replaceHtmlATagsWithMarkdown(str: string) {
  str = str.replace(/'/g, `"`);
  // 正则表达式匹配<a>标签
  // 匹配具有href属性的<a>标签，可选地匹配具有title属性
  const regex =
    /<a\s+(?:[^>]*?\s+)?href="([^"]*)"(\s+title="([^"]*)")?([^>]*)?>(.*?)<\/a>/gi;

  // 使用正则表达式和替换函数进行替换
  return str.replace(regex, (match, href, title, titleText, rest, linkText) => {
    // 如果有title属性，使用title文本作为链接文本
    const linkTextToUse = titleText || linkText.trim();
    return `[${linkTextToUse}](${href})`;
  });
}
