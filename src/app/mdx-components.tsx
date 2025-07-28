import type { MDXComponents } from 'mdx/types';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold mb-3 text-gray-700 border-b border-gray-200 pb-2">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-medium mb-2 text-gray-700">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mb-3 text-gray-600 leading-relaxed">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="mb-4 list-disc list-inside space-y-1 text-gray-600">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 list-decimal list-inside space-y-1 text-gray-600">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="ml-4">{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-800">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-700">{children}</em>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>
    ),
    pre: ({ children }) => (
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm">{children}</pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 text-gray-700 italic">{children}</blockquote>
    ),
    // Custom components for specific content types
    SectionLabel: ({ children, ...props }) => (
      <div className="content-section mb-3">
        <strong className="section-label text-gray-800 font-semibold">{children}:</strong>
      </div>
    ),
    ExampleNote: ({ children, type = "note", ...props }) => (
      <div className={`p-3 rounded-lg mb-3 ${
        type === 'example' ? 'bg-green-50 border border-green-200' :
        type === 'warning' ? 'bg-red-50 border border-red-200' :
        type === 'tip' ? 'bg-yellow-50 border border-yellow-200' :
        'bg-blue-50 border border-blue-200'
      }`}>
        <strong className="block mb-1 text-gray-800">
          {type.charAt(0).toUpperCase() + type.slice(1)}:
        </strong>
        <div className="text-gray-700">{children}</div>
      </div>
    ),
    ...components,
  };
} 