"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Edit } from "lucide-react"
import { Pagination } from "@/components/pagination"

interface Comment {
  id: number
  email: string
  name: string
  body: string
  postTitle: string
}

interface CommentsTableProps {
  comments: Comment[]
  onUpdateComment: (id: number, field: "name" | "body", value: string) => void
}

interface EditableCellProps {
  value: string
  onSave: (value: string) => void
  multiline?: boolean
}

function EditableCell({ value, onSave, multiline = false }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && multiline && textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = "auto"
      textarea.style.height = Math.max(120, textarea.scrollHeight) + "px"
    }
  }, [editValue, isEditing, multiline])

  const handleSave = () => {
    onSave(editValue)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === "Escape") {
      setEditValue(value)
      setIsEditing(false)
    }
  }

  const hasChanges = editValue !== value

  if (isEditing) {
    return (
      <div className="w-full">
        {multiline ? (
          <div className="space-y-2">
            <textarea
              ref={textareaRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full min-h-[120px] px-3 py-2 border border-border rounded-lg shadow-sm focus:ring-2 focus:ring-ring focus:border-primary resize-none whitespace-pre-wrap break-words transition-all duration-200 overflow-hidden bg-secondary leading-relaxed"
              autoFocus
              style={{ height: "auto" }}
            />
            {hasChanges && (
              <button
                onClick={handleSave}
                className="mt-2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded hover:bg-accent transition-all duration-200"
              >
                Save
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-200"
              autoFocus
            />
            {hasChanges && (
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded hover:bg-accent transition-all duration-200"
              >
                Save
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative group">
      <div className="pr-8">
        {multiline ? (
          <div
            className="whitespace-pre-wrap break-words text-sm text-foreground leading-relaxed line-clamp-5"
            title={value}
          >
            {value}
          </div>
        ) : (
          <div className="text-sm text-foreground truncate" title={value}>
            {value}
          </div>
        )}
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-0 right-0 p-1 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-200"
        title="Edit"
      >
        <Edit className="h-3 w-3" />
      </button>
    </div>
  )
}

export function CommentsTable({ comments, onUpdateComment }: CommentsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(comments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentComments = comments.slice(startIndex, endIndex)

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [comments])

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No comments found matching your search.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full border-collapse table-fixed">
            <thead>
              <tr className="bg-secondary border-b border-border">
                <th className="w-[18%] text-left px-4 py-4 font-semibold text-primary">Email</th>
                <th className="w-[25%] text-left px-4 py-4 font-semibold text-primary">Name</th>
                <th className="w-[32%] text-left px-4 py-4 font-semibold text-primary">Body</th>
                <th className="w-[25%] text-left px-4 py-4 font-semibold text-primary">Post Title</th>
              </tr>
            </thead>
            <tbody>
              {currentComments.map((comment, index) => (
                <tr
                  key={comment.id}
                  className={`border-b border-border hover:bg-muted transition-colors duration-200 ${
                    index % 2 === 0 ? "bg-card" : "bg-muted/30"
                  }`}
                >
                  <td className="w-[18%] px-4 py-4 align-top">
                    <div className="text-sm text-foreground break-words leading-relaxed">{comment.email}</div>
                  </td>
                  <td className="w-[25%] px-4 py-4 align-top">
                    <EditableCell value={comment.name} onSave={(value) => onUpdateComment(comment.id, "name", value)} />
                  </td>
                  <td className="w-[32%] px-4 py-4 align-top">
                    <EditableCell
                      value={comment.body}
                      onSave={(value) => onUpdateComment(comment.id, "body", value)}
                      multiline
                    />
                  </td>
                  <td className="w-[25%] px-4 py-4 align-top">
                    <div className="text-sm text-foreground break-words leading-relaxed">{comment.postTitle}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
      </div>
    </div>
  )
}
