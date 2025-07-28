import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import remarkGfm from 'remark-gfm'

// Utility function to render MDX content dynamically
export async function renderMDXContent(markdownContent: string) {
  try {
    // Compile the markdown to MDX
    const compiled = await compile(markdownContent, {
      outputFormat: 'function-body',
      remarkPlugins: [remarkGfm],
      development: false,
      format: 'mdx'
    })

    // Run the compiled code with proper runtime
    const { default: Content } = await run(compiled, runtime)
    
    return Content
  } catch (error) {
    console.error('Error compiling MDX:', error)
    // Return a fallback component that displays the error
    return () => (
      <div className="text-red-500 p-4 border border-red-300 rounded">
        <p><strong>Error rendering content:</strong></p>
        <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
        <details className="mt-2">
          <summary className="cursor-pointer text-sm underline">Raw content (first 500 chars)</summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
            {markdownContent.substring(0, 500)}...
          </pre>
        </details>
      </div>
    )
  }
}

// Enhanced markdown preprocessor to make content more MDX-friendly
export function preprocessMarkdownForMDX(content: string): string {
  let processed = content

  // First, extract and protect ALL types of code blocks more thoroughly
  const codeBlocks: string[] = []
  const codeBlockPlaceholder = '___CODE_BLOCK___'
  
  // Extract fenced code blocks (```language...```)
  processed = processed.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match)
    return `${codeBlockPlaceholder}${codeBlocks.length - 1}${codeBlockPlaceholder}`
  })
  
  // Extract inline code (`code`)
  processed = processed.replace(/`[^`\n]+`/g, (match) => {
    codeBlocks.push(match)
    return `${codeBlockPlaceholder}${codeBlocks.length - 1}${codeBlockPlaceholder}`
  })

  // Extract any remaining code-like patterns that might contain braces
  processed = processed.replace(/\{[^}]*\}/g, (match) => {
    // Only extract if it looks like code (contains keywords, operators, etc.)
    if (match.includes('::') || match.includes('<<') || match.includes('cout') || match.includes('endl') || 
        match.includes('public:') || match.includes('private:') || match.includes('protected:')) {
      codeBlocks.push(match)
      return `${codeBlockPlaceholder}${codeBlocks.length - 1}${codeBlockPlaceholder}`
    }
    return match
  })

  // Now safely escape remaining problematic characters
  processed = processed.replace(/\{/g, '\\{')
  processed = processed.replace(/\}/g, '\\}')
  processed = processed.replace(/</g, '\\<')

  // Convert common patterns to proper markdown
  
  // Handle underlined headings
  processed = processed.replace(/^(.+)\n=+$/gm, '# $1')
  processed = processed.replace(/^(.+)\n-+$/gm, '## $1')
  
  // Handle numbered sections more intelligently
  processed = processed.replace(/^([IVXLCDM]+\.|Chapter\s+\d+|Section\s+\d+)\s+(.+)$/gm, '## $1 $2')
  processed = processed.replace(/^(\d+[\.\)])\s+(.+)$/gm, '### $1 $2')
  
  // Handle labels (word followed by colon) as headings or special components
  processed = processed.replace(/^([A-Za-z][A-Za-z\s]*?):\s*(.*)$/gm, (match, label, content) => {
    if (content.trim()) {
      return `**${label}:** ${content}`
    } else {
      return `### ${label}`
    }
  })
  
  // Handle special notes/examples (but make them simpler for MDX)
  processed = processed.replace(/^(Example|Note|Important|Warning|Tip):\s*(.*)$/gmi, 
    '> **$1:** $2')
  
  // Convert bullet points to proper markdown lists
  processed = processed.replace(/^[\s]*[*\-+•]\s+(.+)$/gm, '- $1')
  
  // Handle indented content as nested lists (but be more conservative)
  processed = processed.replace(/^  [\s\t]*([^\s].*)$/gm, '  - $1')
  
  // Clean up extra whitespace
  processed = processed.replace(/\n{3,}/g, '\n\n')
  
  // Restore code blocks using the more specific placeholder pattern
  codeBlocks.forEach((block, index) => {
    const placeholder = `${codeBlockPlaceholder}${index}${codeBlockPlaceholder}`
    processed = processed.replace(placeholder, block)
  })
  
  return processed
} 