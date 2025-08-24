"use client"

import { useEffect, useState } from "react"
import { motion, stagger, useAnimate } from "framer-motion"
import { cn } from "@/lib/utils"

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  renderAsHtml = false,
}: {
  words: string
  className?: string
  filter?: boolean
  duration?: number
  renderAsHtml?: boolean
}) => {
  const [scope, animate] = useAnimate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isComplete, setIsComplete] = useState(false)

  const parseMarkdown = (text: string): string => {
    if (!renderAsHtml) return text

    // Parse bold text **text**
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Parse italic text *text*
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Parse bullet points
    text = text.replace(/^\* (.*$)/gim, "<li>$1</li>")

    // Wrap consecutive list items in ul tags
    text = text.replace(/(<li>[\s\S]*<\/li>)/g, (match) => {
      return `<ul class="list-disc list-inside space-y-1 my-2">${match}</ul>`
    })

    return text
  }

  const processedText = parseMarkdown(words)
  const wordsArray = renderAsHtml ? processedText.split(" ") : words.split(" ")

  useEffect(() => {
    setIsComplete(false)
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.1),
        onComplete: () => setIsComplete(true),
      },
    )
  }, [words, animate, duration, filter])

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="opacity-0"
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
              {...(renderAsHtml ? { dangerouslySetInnerHTML: { __html: word + " " } } : { children: word + " " })}
            />
          )
        })}
      </motion.div>
    )
  }

  return (
    <div className={cn("font-normal", className)}>
      <div className="leading-snug tracking-wide">{renderWords()}</div>
    </div>
  )
}
