"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter, useSearchParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useIdStore } from "@/stores/idStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface ListItem {
  id: string;
  name: string;
  description: string;
}

export default function ChatView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selection = searchParams.get("selection") || "No selection";
  const selectionType = searchParams.get("type") || "unknown";

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [isLoadingSidebar, setIsLoadingSidebar] = useState(true);

  const { id } = useIdStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  }, [inputMessage]);

  // Load sidebar items from API
  useEffect(() => {
    const loadSidebarItems = async () => {
      setIsLoadingSidebar(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const mockItems = [
          {
            id: "1",
            name: "Data Analysis",
            description: "Comprehensive data analysis tools and insights",
          },
          {
            id: "2",
            name: "Performance Metrics",
            description: "Real-time performance monitoring and analytics",
          },
          {
            id: "3",
            name: "User Behavior",
            description: "Track and analyze user interactions and patterns",
          },
          {
            id: "4",
            name: "Security Scan",
            description:
              "Automated security vulnerability assessment and reporting",
          },
          {
            id: "5",
            name: "SEO Optimization",
            description:
              "Search engine optimization recommendations and analysis",
          },
          {
            id: "6",
            name: "Accessibility Check",
            description: "Web accessibility compliance testing and validation",
          },
          {
            id: "7",
            name: "Code Quality",
            description: "Static code analysis and quality metrics evaluation",
          },
          {
            id: "8",
            name: "Load Testing",
            description: "Performance testing under various load conditions",
          },
          {
            id: "9",
            name: "API Documentation",
            description:
              "Automated API documentation generation and validation",
          },
          {
            id: "10",
            name: "Database Optimization",
            description: "Query optimization and database performance tuning",
          },
          {
            id: "11",
            name: "Content Analysis",
            description:
              "Content quality assessment and improvement suggestions",
          },
          {
            id: "12",
            name: "Mobile Responsiveness",
            description:
              "Mobile device compatibility and responsive design testing",
          },
          {
            id: "13",
            name: "Browser Compatibility",
            description: "Cross-browser compatibility testing and validation",
          },
          {
            id: "14",
            name: "Error Monitoring",
            description: "Real-time error tracking and monitoring system",
          },
          {
            id: "15",
            name: "Cache Optimization",
            description: "Caching strategy optimization for better performance",
          },
          {
            id: "16",
            name: "Image Optimization",
            description: "Image compression and format optimization tools",
          },
          {
            id: "17",
            name: "Font Analysis",
            description: "Typography and font loading performance analysis",
          },
          {
            id: "18",
            name: "Third-party Scripts",
            description: "External script impact analysis and optimization",
          },
        ];
        setListItems(mockItems);
      } catch (error) {
        console.error("Failed to load sidebar items:", error);
      } finally {
        setIsLoadingSidebar(false);
      }
    };

    loadSidebarItems();
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    let response = "";
    try {
      // Simulate API call
      await axios
        .post("http://localhost:3001/api/ai/prompt", {
          repoid: id,
          prompt: userMessage.content,
        })
        .then((res) => {
          response = res.data;
        })
        .catch((err) => {
          console.log(err);
        });

      console.log(response);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleBackClick = () => {
    router.push("/");
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="text-sm text-gray-600">
              Selected:{" "}
              <span className="font-medium text-gray-900">{selection}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
        <div className="w-full max-w-6xl h-[680px] flex gap-6">
          {/* Sidebar */}
          <Card className="p-0 w-80 flex flex-col border border-gray-200 shadow-sm rounded-lg overflow-hidden bg-white">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-sm font-medium text-gray-900">Commits</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              {isLoadingSidebar ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
                    <p className="text-sm text-gray-600">Loading tools...</p>
                  </div>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <div className="space-y-2 p-4">
                    {listItems.map((item) => (
                      <Card
                        key={item.id}
                        className="p-3 hover:bg-gray-50 transition-colors cursor-pointer border-gray-200"
                      >
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="flex-1 flex flex-col border border-gray-200 shadow-sm rounded-lg overflow-hidden bg-white">
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Start a conversation to begin analysis
                      </p>
                    </div>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.sender === "user"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {message.sender === "assistant" ? (
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({
                                  node,
                                  inline,
                                  className,
                                  children,
                                  ...props
                                }) {
                                  const match = /language-(\w+)/.exec(
                                    className || ""
                                  );
                                  return !inline && match ? (
                                    <SyntaxHighlighter
                                      style={oneDark}
                                      language={match[1]}
                                      PreTag="div"
                                      className="rounded-md text-sm"
                                      {...props}
                                    >
                                      {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                  ) : (
                                    <code
                                      className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-sm"
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  );
                                },
                                h1: ({ children }) => (
                                  <h1 className="text-lg font-bold mb-2">
                                    {children}
                                  </h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="text-base font-semibold mb-2">
                                    {children}
                                  </h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="text-sm font-medium mb-1">
                                    {children}
                                  </h3>
                                ),
                                p: ({ children }) => (
                                  <p className="mb-2 last:mb-0">{children}</p>
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc list-inside mb-2 space-y-1">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal list-inside mb-2 space-y-1">
                                    {children}
                                  </ol>
                                ),
                                li: ({ children }) => (
                                  <li className="text-sm">{children}</li>
                                ),
                                blockquote: ({ children }) => (
                                  <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2">
                                    {children}
                                  </blockquote>
                                ),
                                a: ({ children, href }) => (
                                  <a
                                    href={href}
                                    className="text-blue-600 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {children}
                                  </a>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-semibold">
                                    {children}
                                  </strong>
                                ),
                                em: ({ children }) => (
                                  <em className="italic">{children}</em>
                                ),
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                        )}
                        <p
                          className={`text-xs mt-2 ${
                            message.sender === "user"
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg px-4 py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2 items-end">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                  rows={1}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
