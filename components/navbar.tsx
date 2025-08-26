"use client"

import { Input } from "@/components/ui/input"

interface NavbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-foreground">Comments Dashboard</h1>
        <div className="w-80">
          <Input
            type="text"
            placeholder="Search comments..."
            className="rounded-lg bg-input border-border shadow-sm focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-200"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </nav>
  )
}
