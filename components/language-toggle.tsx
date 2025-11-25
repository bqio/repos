"use client"

import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import type { Language } from "@/lib/i18n"

export function LanguageToggle() {
  const [language, setLanguage] = useState<Language>("ru")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage: Language = language === "ru" ? "en" : "ru"
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
    window.dispatchEvent(new CustomEvent("languageChange", { detail: newLanguage }))
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleLanguage}
      title={language === "ru" ? "Switch to English" : "Переключить на русский"}
    >
      <Languages className="h-5 w-5" />
      <span className="sr-only">{language === "ru" ? "EN" : "RU"}</span>
    </Button>
  )
}
