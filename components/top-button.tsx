'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronUp } from 'lucide-react'

export default function TopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {isVisible && (
        <Button
          className="fixed bottom-8 right-8 rounded-full p-3 bg-red-500 hover:bg-red-600"
          onClick={scrollToTop}
          size="icon"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}
    </>
  )
}

