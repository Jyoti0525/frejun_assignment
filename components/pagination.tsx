"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
}

export function Pagination({ currentPage, totalPages, onPrevious, onNext }: PaginationProps) {
  const handlePrevious = () => {
    onPrevious()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNext = () => {
    onNext()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex items-center justify-center gap-6">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-6 py-3 rounded-lg border-border hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-muted disabled:hover:text-muted-foreground disabled:hover:border-border transition-all duration-200 bg-card shadow-sm"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <span className="text-sm text-muted-foreground font-medium px-4 py-2 bg-secondary rounded-lg">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-6 py-3 rounded-lg border-border hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-muted disabled:hover:text-muted-foreground disabled:hover:border-border transition-all duration-200 bg-card shadow-sm"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
