"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Video, Sparkles, ArrowLeft, Image as ImageIcon, X } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  videoUrl?: string
  isGenerating?: boolean
  imageUrl?: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI video generation assistant powered by Veo-v3. Describe the video you'd like to create, and I'll generate it for you. Be as detailed as possible about the scene, style, and mood you want.",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const removeSelectedImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!input.trim() && !selectedImage) || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
      imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Add generating message
    const generatingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "Generating your video with Veo-v3... This may take a few moments.",
      role: "assistant",
      timestamp: new Date(),
      isGenerating: true,
    }

    setMessages((prev) => [...prev, generatingMessage])

    try {
      const formData = new FormData()
      formData.append("prompt", input)
      if (selectedImage) {
        formData.append("image", selectedImage)
      }

      const response = await fetch("http://localhost:5001/generate-video", {
        method: "POST",
        body: formData,
        mode: 'cors',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        const responseMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: data.response,
          role: "assistant",
          timestamp: new Date(),
        }

        setMessages((prev) => prev.filter((msg) => !msg.isGenerating).concat(responseMessage))
      } else {
        throw new Error(data.error || "Failed to generate video")
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: `Error: ${error instanceof Error ? error.message : "Failed to generate video"}`,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => prev.filter((msg) => !msg.isGenerating).concat(errorMessage))
    } finally {
      setIsLoading(false)
      setSelectedImage(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">Veo-v3 Video Generator</h1>
                  <p className="text-sm text-gray-600">Powered by Acolyte Health</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Online
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-col h-[calc(100vh-200px)]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-6 mb-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={message.role === "user" ? "bg-blue-100" : "bg-purple-100"}>
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-purple-600" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className={`flex-1 max-w-3xl ${message.role === "user" ? "text-right" : ""}`}>
                  <div
                    className={`inline-block p-4 rounded-2xl ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 text-gray-900"
                    }`}
                  >
                    {message.imageUrl && (
                      <div className="mb-3">
                        <img
                          src={message.imageUrl}
                          alt="Uploaded reference"
                          className="max-w-xs rounded-lg shadow-sm"
                        />
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>

                    {message.isGenerating && (
                      <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-200">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">Generating video...</span>
                      </div>
                    )}

                    {message.videoUrl && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Card className="overflow-hidden">
                          <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center text-white space-y-2">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                                  <Video className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-sm font-medium">Generated Video</p>
                                <p className="text-xs text-gray-300">Click to play</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 bg-white">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Sparkles className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-gray-900">AI Generated</span>
                              </div>
                              <Button size="sm" variant="outline">
                                Download
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <Card className="p-4 bg-white border-gray-200">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Describe the video you want to create... (e.g., 'A serene sunset over a mountain lake with gentle waves')"
                      className="min-h-[48px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    {selectedImage && (
                      <div className="absolute -top-2 -right-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 rounded-full bg-gray-100 hover:bg-gray-200"
                          onClick={removeSelectedImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    type="submit"
                    disabled={(!input.trim() && !selectedImage) || isLoading}
                    className="h-12 w-12 p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Be specific about scenes, style, mood, and visual elements for best results
                </p>
              </div>
            </form>
          </Card>

          {/* Tips */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              💡 Tip: Include details about lighting, camera angles, and movement for more precise video generation
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
