"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import MDXContent from "./components/mdx-content";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export default function Home() {  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [blogContent, setBlogContent] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleContentGeneration = async () => {
    const content = textareaRef.current?.value || "";
    console.log("Generating blog...", content);
    
    if (!content.trim()) {
      alert("Please enter a topic for your blog!");
      return;
    }

    setIsLoading(true);
    setBlogContent(""); // Clear previous content

    try {
      const response = await fetch("/api/generate-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: content
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === "success" && data.blog_post) {
        setBlogContent(data.blog_post);
      } else {
        throw new Error("Failed to generate blog post");
      }
    } catch (error) {
      console.error("Error generating blog:", error);
      setBlogContent("Error: Failed to generate blog post. Please make sure the API server is running on port 5000.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!blogContent) return;
    
    try {
      await navigator.clipboard.writeText(blogContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = blogContent;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current || !blogContent) return;
    
    setIsDownloading(true);
    
    try {
      const element = contentRef.current;
      
      const canvas = await html2canvas(element, {
        scrollX: 0,
        scrollY: -window.scrollY,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      
      const topic = textareaRef.current?.value || 'note';
      const filename = `${topic.replace(/\s+/g, '_')}.pdf`;
      
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <div className="content-area">
        <h1 className="app-title">AI NOTE CREATOR</h1>
        
        <div className="generated-content relative" ref={contentRef}>
          {/* Action buttons - Copy and PDF Download */}
          {blogContent && !isLoading && (
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              {/* Copy Button */}
              <button
                onClick={handleCopyToClipboard}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  copySuccess 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : 'bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 shadow-md hover:shadow-lg border border-gray-200'
                }`}
                title="Copy content to clipboard"
              >
                {copySuccess ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              {/* PDF Download Button */}
              <button
                onClick={handleDownloadPDF}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDownloading 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 shadow-md hover:shadow-lg border border-gray-200'
                }`}
                title="Download as PDF"
                disabled={isDownloading || !blogContent}
              >
                {isDownloading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </button>
            </div>
          )}
          
          {isLoading ? (
            <p className="placeholder-text">Generating your note...</p>
          ) : blogContent ? (
            <MDXContent content={blogContent} />
          ) : (
            <p className="placeholder-text">Your generated note will appear here...</p>
          )}
        </div>
      </div>
      <div className="input-wrapper">
        <textarea 
          ref={textareaRef}
          placeholder="How can I help you create a note?" 
          name="text" 
          className="input"
        />
        <button 
          className="btn" 
          onClick={handleContentGeneration}
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.7 : 1 }}
        >
          <div className="loader">
            <div className={`loading_bar ${isLoading ? 'animate' : ''}`}></div>
            <div className={`loading_bar ${isLoading ? 'animate' : ''}`}></div>
            <div className={`loading_bar ${isLoading ? 'animate' : ''}`}></div>
          </div>
        </button>
      </div>
    </div>
  );
}