"use client"

import { useEffect, useState, useRef } from "react"

interface TypewriterProps {
  words: string[]
  speed?: number
  delayBetweenWords?: number
  cursor?: boolean
  cursorChar?: string
  className?: string
  loop?: boolean
  onComplete?: () => void
}

export function Typewriter({
  words,
  speed = 100,
  delayBetweenWords = 2000,
  cursor = true,
  cursorChar = "|",
  className,
  loop = true,
  onComplete,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [done, setDone] = useState(false)
  const completeCalled = useRef(false)

  const currentWord = words[wordIndex]
  const isLastWord = wordIndex === words.length - 1

  useEffect(() => {
    if (done) return

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIndex < currentWord.length) {
            setDisplayText(currentWord.substring(0, charIndex + 1))
            setCharIndex(charIndex + 1)
          } else {
            // Word fully typed
            if (!loop && isLastWord) {
              // Done — hold the last word
              setDone(true)
              if (onComplete && !completeCalled.current) {
                completeCalled.current = true
                onComplete()
              }
              return
            }
            setTimeout(() => {
              setIsDeleting(true)
            }, delayBetweenWords)
          }
        } else {
          if (charIndex > 0) {
            setDisplayText(currentWord.substring(0, charIndex - 1))
            setCharIndex(charIndex - 1)
          } else {
            setIsDeleting(false)
            if (loop) {
              setWordIndex((prev) => (prev + 1) % words.length)
            } else {
              setWordIndex((prev) => prev + 1)
            }
          }
        }
      },
      isDeleting ? speed / 2 : speed,
    )

    return () => clearTimeout(timeout)
  }, [charIndex, currentWord, isDeleting, isLastWord, speed, delayBetweenWords, wordIndex, words, loop, done, onComplete])

  useEffect(() => {
    if (!cursor) return

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [cursor])

  return (
    <span className={className}>
      {displayText}
      {cursor && !done && (
        <span className="ml-1 transition-opacity duration-75" style={{ opacity: showCursor ? 1 : 0 }}>
          {cursorChar}
        </span>
      )}
    </span>
  )
}
