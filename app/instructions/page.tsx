'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { translations, type Language } from '@/lib/i18n';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';

export default function InstructionsPage() {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    const handleLanguageChange = (e: CustomEvent<Language>) => {
      setLanguage(e.detail);
    };
    window.addEventListener(
      'languageChange',
      handleLanguageChange as EventListener,
    );
    return () =>
      window.removeEventListener(
        'languageChange',
        handleLanguageChange as EventListener,
      );
  }, []);

  const t = translations[language];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/manager">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">{t.back}</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{t.instructions}</h1>
          <div className="ml-auto flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="p-8">
            {language === 'ru' ? (
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    Структура JSON файла
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Репозиторий представляет собой JSON файл со следующей
                    структурой:
                  </p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    {`{
  "name": "Название репозитория",
  "version": "1.0.0",
  "description": "Описание репозитория",
  "author": "Имя автора",
  "items": [
    {
      "title": "Название",
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
                          <code className="bg-muted px-1 rounded">name</code> -
                          название репозитория (обязательное)
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">version</code>{' '}
                          - версия репозитория (обязательное)
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">
                            description
                          </code>{' '}
                          - описание репозитория (опциональное)
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">author</code>{' '}
                          - имя автора репозитория (опциональное)
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">items</code> -
                          массив элементов (обязательное)
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mt-4">Поля элемента:</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 ml-2">
                        <li>
                          <code className="bg-muted px-1 rounded">title</code> -
                          название (обязательное)
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">hash</code> -
                          INFO HASH торрента (обязательное)
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">tracker</code>{' '}
                          - URL трекера для magnet-ссылки (обязательное)
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">poster</code>{' '}
                          - URL изображения постера (обязательное)
                          <br />
                          <strong>
                            Рекомендуемые параметры: Размер 400x640 пикселей,
                            формат webp, качество 50
                          </strong>
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">size</code> -
                          размер в байтах (обязательное)
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">
                            published_date
                          </code>{' '}
                          - дата публикации в Unix timestamp (опциональное)
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    Как получить INFO HASH?
                  </h2>
                  <p className="text-muted-foreground">
                    INFO HASH - это уникальный идентификатор торрента (40
                    символов в HEX формате). Его можно получить из торрент-файла
                    или из magnet-ссылки (после{' '}
                    <code className="bg-muted px-1 rounded">btih:</code>).
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    Способы добавления
                  </h2>
                  <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-2">
                    <li>
                      Разместите JSON файл на любом веб-хостинге и добавьте его
                      по URL
                    </li>
                    <li>
                      Загрузите JSON файл напрямую через кнопку "Загрузить JSON
                      файл"
                    </li>
                  </ol>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    CORS и кэширование
                  </h2>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li>
                      Если репозиторий находится на удалённом сервере, то
                      необходимо правильно настроить CORS и кэширование.
                    </li>
                    <li>
                      При неправильной настройке CORS приложение будет выдавать
                      ошибку{' '}
                      <strong>
                        Не удалось загрузить репозиторий по ссылке. Возможно
                        проблема с CORS или сетью.
                      </strong>
                    </li>
                    <li>
                      При неправильной настройке кэширования автообновление
                      репозитория может работать со сбоями.
                    </li>
                    <li>
                      Сервер должен отправлять корректные заголовки{' '}
                      <code className="bg-muted px-1 rounded">
                        Access-Control-Allow-Origin
                      </code>{' '}
                      и{' '}
                      <code className="bg-muted px-1 rounded">
                        Cache-Control
                      </code>
                      .
                    </li>
                  </ul>
                </section>
              </div>
            ) : (
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    JSON File Structure
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    A repository is a JSON file with the following structure:
                  </p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    {`{
  "name": "Repository name",
  "version": "1.0.0",
  "description": "Repository description",
  "author": "Author name"
  "items": [
    {
      "title": "Item title",
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
                  <h2 className="text-xl font-semibold mb-3">
                    Field Descriptions
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold">Repository fields:</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 ml-2">
                        <li>
                          <code className="bg-muted px-1 rounded">name</code> -
                          repository name (required)
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">version</code>{' '}
                          - repository version (required)
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">
                            description
                          </code>{' '}
                          - repository description (optional)
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">author</code>{' '}
                          - repository author name (optional)
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">items</code> -
                          array of items (required)
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mt-4">Item fields:</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2 ml-2">
                        <li>
                          <code className="bg-muted px-1 rounded">title</code> -
                          item title (required)
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">hash</code> -
                          torrent INFO HASH (required)
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">tracker</code>{' '}
                          - tracker URL for magnet link (required)
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">poster</code>{' '}
                          - poster image URL (required)
                          <br />
                          <strong>
                            Recommended params: Size 400x640 pixels, format
                            webp, quality 50
                          </strong>
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">size</code> -
                          size in bytes (required)
                        </li>
                        <li>
                          <code className="bg-muted px-1 rounded">
                            published_date
                          </code>{' '}
                          - publication date in Unix timestamp (optional)
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    How to get INFO HASH?
                  </h2>
                  <p className="text-muted-foreground">
                    INFO HASH is a unique torrent identifier (40 characters in
                    HEX format). You can get it from a torrent file or from a
                    magnet link (after{' '}
                    <code className="bg-muted px-1 rounded">btih:</code>).
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">Adding Methods</h2>
                  <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-2">
                    <li>
                      Host the JSON file on any web hosting and add it by URL
                    </li>
                    <li>
                      Upload the JSON file directly via "Upload JSON file"
                      button
                    </li>
                  </ol>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    CORS and Caching
                  </h2>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li>
                      If the repository is located on a remote server, CORS and
                      caching must be configured correctly.
                    </li>
                    <li>
                      If CORS is misconfigured, the application will display the
                      error:{' '}
                      <strong>
                        Failed to load repository from URL. Possible CORS or
                        network issue.
                      </strong>
                    </li>
                    <li>
                      If caching is misconfigured, automatic repository updates
                      may not work correctly.
                    </li>
                    <li>
                      The server must send the correct{' '}
                      <code className="bg-muted px-1 rounded">
                        Access-Control-Allow-Origin
                      </code>{' '}
                      and{' '}
                      <code className="bg-muted px-1 rounded">
                        Cache-Control
                      </code>
                      headers.
                    </li>
                  </ul>
                </section>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
