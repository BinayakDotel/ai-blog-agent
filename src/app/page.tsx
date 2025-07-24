"use client";

import Image from "next/image";
import { useRef } from "react";

export default function Home() {  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const blogareaRef = useRef<HTMLDivElement>(null);
  
  const handleGenerateBlog = async () => {
    const content = textareaRef.current?.value || "";
    console.log("Generating blog...", content);
    
    if (!content.trim()) {
      alert("Please enter a topic for your blog!");
      return;
    }

    if (blogareaRef.current) {
      blogareaRef.current.innerHTML = "<p>Generating your blog post...</p>";
    }

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
        if (blogareaRef.current) {
          // Convert markdown-like content to HTML for better display
          const formattedContent = data.blog_post
            .replace(/\n/g, '<br>')
            .replace(/## (.*?)(<br>|$)/g, '<h2>$1</h2>')
            .replace(/### (.*?)(<br>|$)/g, '<h3>$1</h3>')
            .replace(/\* (.*?)(<br>|$)/g, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
          
          blogareaRef.current.innerHTML = formattedContent;
        }
      } else {
        throw new Error("Failed to generate blog post");
      }
    } catch (error) {
      console.error("Error generating blog:", error);
      if (blogareaRef.current) {
        blogareaRef.current.innerHTML = `<p style="color: red;">Error: Failed to generate blog post. Please make sure the API server is running on port 5000.</p>`;
      }
    }
  };

  return (
    <div>
      <div className="content-area">
        <h1 className="app-title">Blog Creator</h1>
        <div className="generated-content" ref={blogareaRef}>
          <p className="placeholder-text">Your generated blog post will appear here...</p>
        </div>
      </div>
      <div className="input-wrapper">
        <textarea 
          ref={textareaRef}
          placeholder="How can I help you create a blog?" 
          name="text" 
          className="input"
        />
        <button className="btn" onClick={handleGenerateBlog}>
            <span className="btn-text-one">+</span>
        </button>
      </div>
    </div>
  );
}
