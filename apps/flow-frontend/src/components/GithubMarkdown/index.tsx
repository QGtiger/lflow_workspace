import ReactMarkdown from 'react-markdown';

import 'github-markdown-css';
import './index.css';

const customLinkRenderer = ({ href, children }: any) => {
  return (
    <a href={href} className=" text-[#1677ff]" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

export default function GithubMarkdown(props: React.ComponentProps<typeof ReactMarkdown>) {
  return (
    <ReactMarkdown
      {...props}
      components={{
        a: customLinkRenderer,
      }}
      className={`markdown-body github-markdown-body ${props.className}`}
    ></ReactMarkdown>
  );
}
