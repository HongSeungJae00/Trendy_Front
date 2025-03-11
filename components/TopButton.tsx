'use client'

import { ChevronUp } from 'lucide-react'

export function TopButton() {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-16 right-5 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-300 z-50"
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-4 w-4" />
    </button>
  )
}

