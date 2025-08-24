"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Send, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { TextGenerateEffect } from "./text-generationeffect"
import Image from "next/image"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  isGenerating?: boolean
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello Rayudu Bharani! I'm your personal AI assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from AI')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || data.message || "I apologize, but I couldn't generate a proper response.",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b bg-card px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
            <AvatarFallback className="bg-gradient-to-r from-primary to-primary/40 text-white">
              <Image src="/Frame 2.png" alt="Bharani's Avatar" width={32} height={32} className="rounded-full" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-base sm:text-lg">Bharani&rsquo;s AI Assistant</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Your personal AI companion</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex gap-2 sm:gap-3 max-w-full sm:max-w-3xl", message.role === "user" ? "ml-auto flex-row-reverse" : "")}
          >
            <Avatar className="h-6 w-6 sm:h-8 sm:w-8 shrink-0">
              <AvatarFallback
                className={cn(
                  message.role === "user"
                    ? "bg-gradient-to-r from-primary to-primary/40 text-white"
                    : "bg-gradient-to-r from-purple-500 to-blue-600 text-white",
                )}
              >
                {message.role === "user" ? <User className="h-3 w-3 sm:h-4 sm:w-4" /> :  <Image src="/Frame 2.png" alt="Bharani's Avatar" width={32} height={32} className="rounded-full" />}
              </AvatarFallback>
            </Avatar>

            <Card
              className={cn(
                "px-3 py-2 sm:px-4 sm:py-3 max-w-[85%] sm:max-w-[80%]",
                message.role === "user"
                  ? "bg-muted text-muted-foreground"
                  : "bg-muted border-muted",
              )}
            >
              <div className="text-xs sm:text-sm leading-relaxed">
                {message.role === "assistant" && message.isGenerating ? (
                  <TextGenerateEffect
                    words={message.content.replace(/\n{3,}/g, '\n\n')}
                    className="text-foreground"
                    duration={0.3}
                    renderAsHtml={true}
                  />
                ) : (
                  <div className="whitespace-pre-line break-words">{message.content}</div>
                )}
              </div>
              <div
                className={cn(
                  "text-[10px] sm:text-xs mt-1 sm:mt-2 opacity-70",
                  message.role === "user" ? "text-black" : "text-muted-foreground",
                )}
              >
                {message.timestamp.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
              </div>
            </Card>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-3xl">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
                 <Image src="/Frame 2.png" alt="Bharani's Avatar" width={32} height={32} className="rounded-full" />
              </AvatarFallback>
            </Avatar>
            <Card className="px-4 py-3 bg-muted">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-card px-3 sm:px-6 py-3 sm:py-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1 focus:ring-2 focus:ring-blue-500 min-h-[45px] sm:min-h-[60px] max-h-[120px] sm:max-h-[200px] text-sm"
            autoFocus
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="icon"
            className="bg-gradient-to-r from-primary to-primary/40 h-[45px] w-[45px] sm:h-[60px] sm:w-[60px]"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}