"use client";

import React, { useEffect, useState } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { useMDXComponents } from '../mdx-components';
import { renderMDXContent, preprocessMarkdownForMDX } from '../utils/mdx-renderer';

interface MDXContentProps {
  content: string;
}

// Simple fallback renderer for when MDX compilation fails
function SimpleFallbackRenderer({ content }: { content: string }) {
  const formatSimpleContent = (text: string) => {
    let formatted = text;
    
    // Convert basic markdown to HTML
    formatted = formatted.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4 text-blue-600">$1</h1>');
    formatted = formatted.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-3 text-blue-600 border-b border-gray-200 pb-2">$1</h2>');
    formatted = formatted.replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mb-2 text-blue-600">$1</h3>');
    formatted = formatted.replace(/^#### (.*$)/gm, '<h4 class="text-lg font-medium mb-2 text-gray-700">$1</h4>');
    
    // Handle bold and italic
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-blue-600">$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>');
    
    // Handle code blocks first (before inline code)
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, 
      '<pre class="bg-gray-100 border border-gray-300 rounded-lg p-4 overflow-x-auto mb-4 text-sm font-mono"><code>$2</code></pre>');
    
    // Handle inline code
    formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600">$1</code>');
    
    // Handle blockquotes
    formatted = formatted.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 italic">$1</blockquote>');
    
    // Handle lists - convert each line that starts with -
    const lines = formatted.split('\n');
    const processedLines = [];
    let inList = false;
    
    for (const line of lines) {
      if (line.match(/^[\s]*- (.+)$/)) {
        if (!inList) {
          processedLines.push('<ul class="mb-4 list-disc list-inside space-y-1 ml-4">');
          inList = true;
        }
        processedLines.push(line.replace(/^[\s]*- (.+)$/, '<li class="mb-1">$1</li>'));
      } else if (line.match(/^[\s]*\* (.+)$/)) {
        if (!inList) {
          processedLines.push('<ul class="mb-4 list-disc list-inside space-y-1 ml-4">');
          inList = true;
        }
        processedLines.push(line.replace(/^[\s]*\* (.+)$/, '<li class="mb-1">$1</li>'));
      } else {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(line);
      }
    }
    
    if (inList) {
      processedLines.push('</ul>');
    }
    
    formatted = processedLines.join('\n');
    
    // Handle paragraphs - split on double newlines and wrap non-markup text
    formatted = formatted.split('\n\n').map(paragraph => {
      const trimmed = paragraph.trim();
      if (trimmed && !trimmed.includes('<h') && !trimmed.includes('<li') && 
          !trimmed.includes('<ul') && !trimmed.includes('<pre') && 
          !trimmed.includes('<blockquote')) {
        return `<p class="mb-3 leading-relaxed text-gray-700">${trimmed}</p>`;
      }
      return paragraph;
    }).join('\n\n');
    
    return formatted;
  };

  return (
    <div 
      className="prose prose-gray max-w-none"
      dangerouslySetInnerHTML={{ __html: formatSimpleContent(content) }}
    />
  );
}

// Function to detect if content might cause MDX parsing issues
function hasProblematicPatterns(content: string): boolean {
  // Check for patterns that commonly cause MDX parsing issues
  const problematicPatterns = [
    /\{[^}]*\}/g,  // Unescaped braces (outside of code blocks)
    /class\s+\w+\s*\{/g,  // C++ class definitions
    /public:|private:|protected:/g,  // C++ access modifiers
    /cout\s*<<|endl/g,  // C++ iostream
    /#include\s*</g,  // C++ includes
    /^\s*\*\s+/gm  // Bullet points that might conflict
  ];
  
  return problematicPatterns.some(pattern => pattern.test(content));
}

export default function MDXContent({ content }: MDXContentProps) {
  const [MDXComponent, setMDXComponent] = useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  
  const components = useMDXComponents({});

  useEffect(() => {
    async function processMDX() {
      try {
        setIsLoading(true);
        setError(null);
        setUseFallback(false);
        
        // Check if content has patterns that commonly cause issues
        if (hasProblematicPatterns(content)) {
          console.log('Detected potentially problematic patterns, using fallback renderer');
          setUseFallback(true);
          setIsLoading(false);
          return;
        }
        
        // Preprocess the content to make it more MDX-friendly
        const processedContent = preprocessMarkdownForMDX(content);
        
        // Render the MDX content
        const Component = await renderMDXContent(processedContent);
        
        if (Component) {
          setMDXComponent(() => Component);
        } else {
          setError('Failed to compile MDX content');
          setUseFallback(true);
        }
      } catch (err) {
        console.error('Error processing MDX:', err);
        setError('Error processing content - using fallback renderer');
        setUseFallback(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (content) {
      processMDX();
    }
  }, [content]);

  if (isLoading) {
    return <div className="text-gray-500">Processing content...</div>;
  }

  if (useFallback) {
    return (
      <div>
        {error && (
          <div className="text-orange-600 text-sm mb-4 p-2 bg-orange-50 rounded border border-orange-200">
            {error} - Displaying with enhanced formatting.
          </div>
        )}
        <SimpleFallbackRenderer content={content} />
      </div>
    );
  }

  if (error && !useFallback) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!MDXComponent) {
    return <div className="text-gray-500">No content to display</div>;
  }

  return (
    <MDXProvider components={components}>
      <div className="prose prose-gray max-w-none">
        <MDXComponent />
      </div>
    </MDXProvider>
  );
} 