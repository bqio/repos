"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { translations, type Language } from "@/lib/i18n"

export default function InstructionsPage() {
  const [language, setLanguage] = useState<Language>("ru")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    const handleLanguageChange = (e: CustomEvent<Language>) => {
      setLanguage(e.detail)
    }
    window.addEventListener("languageChange", handleLanguageChange as EventListener)
    return () => window.removeEventListener("languageChange", handleLanguageChange as EventListener)
  }, [])

  const t = translations[language]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/manager">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">{t.back}</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{t.createRepository}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-8">
          {language === "ru" ? (
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">Структура JSON файла</h2>
                <p className="text-muted-foreground mb-4">
                  Репозиторий представляет собой JSON файл со следующей структурой:
                </p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  {`{
  "name": "Название репозитория",
  "author": "Имя автора",
  "description": "Описание репозитория",
  "version": "1.0.0",
  "items": [
    {
      "title": "Название игры",
      "hash": "TORRENT_HASH",
      "tracker": "http://tracker.url/announce",
      "poster": "http://example.com/poster.jpg",
      "size": 679597169,
      "published_date": 1579910280
    }
  ]
}`}
                </pre>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Описание полей</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">Поля репозитория:</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 ml-2">
                      <li>
                        <code className="bg-muted px-1 rounded">name</code> - название репозитория (обязательное)
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">author</code> - имя автора репозитория (опциональное)
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">description</code> - описание репозитория (опциональное)
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">version</code> - версия репозитория (опциональное)
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">items</code> - массив элементов (обязательное)
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mt-4">Поля элемента (игры):</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 ml-2">
                      <li>
                        <code className="bg-muted px-1 rounded">title</code> - название игры (обязательное)
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">hash</code> - INFO HASH торрента (обязательное)
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">tracker</code> - URL трекера для magnet-ссылки
                        (обязательное)
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">poster</code> - URL изображения постера (обязательное).{" "}
                        <strong>Рекомендуемый размер: 400x640 пикселей</strong>
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">size</code> - размер в байтах (обязательное)
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">published_date</code> - дата публикации в Unix timestamp
                        (опциональное)
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Как получить INFO HASH?</h2>
                <p className="text-muted-foreground">
                  INFO HASH - это уникальный идентификатор торрента (40 символов в HEX формате). Его можно получить из
                  торрент-файла или из magnet-ссылки (после <code className="bg-muted px-1 rounded">btih:</code>).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Способы добавления</h2>
                <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-2">
                  <li>Разместите JSON файл на любом веб-хостинге и добавьте его по URL</li>
                  <li>Загрузите JSON файл напрямую через кнопку "Загрузить JSON файл"</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Примечания</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                  <li>Изображения постеров кэшируются локально для быстрой загрузки</li>
                  <li>При клике на постер автоматически генерируется magnet-ссылка</li>
                  <li>Размер файла отображается в MB или GB</li>
                  <li>Дата публикации используется для сортировки</li>
                </ul>
              </section>
            </div>
          ) : (
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">JSON File Structure</h2>
                <p className="text-muted-foreground mb-4">A repository is a JSON file with the following structure:</p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  {`{
  "name": "Repository Name",
  "author": "Author Name",
  "description": "Repository description",
  "version": "1.0.0",
  "items": [
    {
      "title": "Game Title",
      "hash": "TORRENT_HASH",
      "tracker": "http://tracker.url/announce",
      "poster": "http://example.com/poster.jpg",
      "size": 679597169,
      "published_date": 1579910280
    }
  ]
}`}
                </pre>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Field Descriptions</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">Repository fields:</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 ml-2">
                      <li>
                        <code className="bg-muted px-1 rounded">name</code> - repository name (required)
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">author</code> - repository author name (optional)
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">description</code> - repository description (optional)
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">version</code> - repository version (optional)
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">items</code> - array of items (required)
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mt-4">Item (game) fields:</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 ml-2">
                      <li>
                        <code className="bg-muted px-1 rounded">title</code> - game title (required)
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">hash</code> - torrent INFO HASH (required)
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">tracker</code> - tracker URL for magnet link (required)
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">poster</code> - poster image URL (required).{" "}
                        <strong>Recommended size: 400x640 pixels</strong>
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">size</code> - size in bytes (required)
                      </li>
                      <li>
                        <code className="bg-muted px-1 rounded">published_date</code> - publication date in Unix
                        timestamp (optional)
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">How to get INFO HASH?</h2>
                <p className="text-muted-foreground">
                  INFO HASH is a unique torrent identifier (40 characters in HEX format). You can get it from a torrent
                  file or from a magnet link (after <code className="bg-muted px-1 rounded">btih:</code>).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Adding Methods</h2>
                <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-2">
                  <li>Host the JSON file on any web hosting and add it by URL</li>
                  <li>Upload the JSON file directly via "Upload JSON file" button</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Notes</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                  <li>Poster images are cached locally for fast loading</li>
                  <li>Clicking on a poster automatically generates a magnet link</li>
                  <li>File size is displayed in MB or GB</li>
                  <li>Publication date is used for sorting</li>
                </ul>
              </section>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
