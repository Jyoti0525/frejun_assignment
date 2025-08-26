"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { CommentsTable } from "@/components/comments-table"

interface Comment {
  id: number
  email: string
  name: string
  body: string
  postId: number
}

interface Post {
  id: number
  title: string
}

interface EnhancedComment {
  id: number
  email: string
  name: string
  body: string
  postTitle: string
}

export default function HomePage() {
  const [comments, setComments] = useState<EnhancedComment[]>([])
  const [filteredComments, setFilteredComments] = useState<EnhancedComment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commentsResponse, postsResponse] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/comments"),
          fetch("https://jsonplaceholder.typicode.com/posts"),
        ])

        const commentsData: Comment[] = await commentsResponse.json()
        const postsData: Post[] = await postsResponse.json()

        // Join comments with posts
        const enhancedComments: EnhancedComment[] = commentsData.map((comment) => {
          const post = postsData.find((p) => p.id === comment.postId)
          return {
            id: comment.id,
            email: comment.email,
            name: comment.name,
            body: comment.body,
            postTitle: post?.title || "Unknown Post",
          }
        })

        // Load edits from localStorage
        const savedEdits = localStorage.getItem("commentEdits")
        if (savedEdits) {
          const edits = JSON.parse(savedEdits)
          enhancedComments.forEach((comment) => {
            if (edits[comment.id]) {
              if (edits[comment.id].name) comment.name = edits[comment.id].name
              if (edits[comment.id].body) comment.body = edits[comment.id].body
            }
          })
        }

        setComments(enhancedComments)
        setFilteredComments(enhancedComments)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredComments(comments)
    } else {
      const filtered = comments.filter(
        (comment) =>
          comment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comment.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comment.postTitle.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredComments(filtered)
    }
  }, [searchQuery, comments])

  const updateComment = (id: number, field: "name" | "body", value: string) => {
    const updatedComments = comments.map((comment) => (comment.id === id ? { ...comment, [field]: value } : comment))
    setComments(updatedComments)

    // Save to localStorage
    const savedEdits = JSON.parse(localStorage.getItem("commentEdits") || "{}")
    if (!savedEdits[id]) savedEdits[id] = {}
    savedEdits[id][field] = value
    localStorage.setItem("commentEdits", JSON.stringify(savedEdits))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-muted-foreground">Loading comments...</div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <CommentsTable comments={filteredComments} onUpdateComment={updateComment} />
        </div>
      </main>
    </div>
  )
}
