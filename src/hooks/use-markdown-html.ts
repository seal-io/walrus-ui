import MarkdownIt from 'markdown-it';

export default function useMarkdownHtml() {
  const md = new MarkdownIt();
  const mdParse = (str) => {
    return md.render(str);
  };
  return {
    mdParse
  };
}
