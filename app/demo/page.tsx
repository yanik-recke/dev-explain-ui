"use client"

import { useState } from "react"
import SelectionView from "../page"
import ChatView from "../chat/page"

export default function DemoPage() {
  const [currentView, setCurrentView] = useState<"selection" | "chat">("selection")
  const [selection, setSelection] = useState<{ type: "url" | "dropdown"; value: string } | null>(null)

  const handleSelection = (type: "url" | "dropdown", value: string) => {
    setSelection({ type, value })
    setCurrentView("chat")
  }

  if (currentView === "selection") {
    return <SelectionView onSelection={handleSelection} />
  }

  return <ChatView />
}
