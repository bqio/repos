'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { check, Update } from '@tauri-apps/plugin-updater';
import { getVersion } from '@tauri-apps/api/app';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { relaunch } from '@tauri-apps/plugin-process';
import {
  Settings,
  Search,
  ArrowUp,
  Star,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import Link from 'next/link';
import { PosterGrid } from '@/components/poster-grid';
import type { Repository, RepositoryItem } from '@/types/repository';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { translations, getItemsLabel, type Language } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { SearchInput } from '@/components/search-input';
import { UpdateDialog } from '@/components/update-dialog';

export default function HomePage() {
  const [activeRepo, setActiveRepo] = useState<Repository | null>(null);
  const [items, setItems] = useState<RepositoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'size'>('date');
  const [reverseSort, setReverseSort] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateVersion, setUpdateVersion] = useState<string | null>(null);
  const [updateState, setUpdateState] = useState<Update | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkForUpdates = async () => {
      const repos = JSON.parse(
        localStorage.getItem('repositories') || '[]',
      ) as Repository[];
      let hasUpdates = false;
      const updatedRepos = [...repos];

      for (let i = 0; i < updatedRepos.length; i++) {
        const repo = updatedRepos[i];
        if (repo.sourceUrl) {
          try {
            console.log(`Sync repo: ${repo.sourceUrl}`);
            const response = await fetch(repo.sourceUrl);
            const data = await response.json();

            updatedRepos[i] = {
              ...repo,
              name: data.name || repo.name,
              author: data.author,
              description: data.description,
              version: data.version,
              items: data.items || [],
            };

            if (data.version && data.version !== repo.version) {
              hasUpdates = true;
              const t = translations[language];
              toast({
                title: t.repoUpdated,
                description: `${repo.name} ${t.repoUpdatedTo} ${data.version}`,
              });
            }
          } catch (error) {
            console.error(`Failed to check updates for ${repo.name}`, error);
          }
        }
      }

      if (hasUpdates) {
        localStorage.setItem('repositories', JSON.stringify(updatedRepos));

        const activeRepoId = localStorage.getItem('activeRepositoryId');
        if (activeRepoId) {
          const active = updatedRepos.find(
            (r: Repository) => r.id === activeRepoId,
          );
          if (active) {
            setActiveRepo(active);
            setItems(active.items || []);
          }
        }
      }
    };

    checkForUpdates();
  }, [language, toast]);

  useEffect(() => {
    const repos = JSON.parse(localStorage.getItem('repositories') || '[]');
    const activeRepoId = localStorage.getItem('activeRepositoryId');

    if (activeRepoId && repos.length > 0) {
      const active = repos.find((r: Repository) => r.id === activeRepoId);
      if (active) {
        setActiveRepo(active);
        setItems(active.items || []);
      }
    } else if (repos.length > 0) {
      setActiveRepo(repos[0]);
      setItems(repos[0].items || []);
      localStorage.setItem('activeRepositoryId', repos[0].id);
    }

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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setApplicationVersion();
    checkReposUpdates();
  }, []);

  const handleUpdate = async () => {
    setOpenUpdateDialog(false);

    let downloaded = 0;
    let contentLength = 0;

    await updateState!.downloadAndInstall((event) => {
      switch (event.event) {
        case 'Started':
          contentLength = event.data.contentLength!;
          console.log(`started downloading ${event.data.contentLength} bytes`);
          break;
        case 'Progress':
          downloaded += event.data.chunkLength;
          console.log(`downloaded ${downloaded} from ${contentLength}`);
          break;
        case 'Finished':
          console.log('download finished');
          break;
      }
    });

    console.log('update installed2');
    await relaunch();
  };

  const setApplicationVersion = async () => {
    const window = getCurrentWindow();
    const appVersion = await getVersion();

    await window.setTitle(`Repos ${appVersion}`);
  };

  const checkReposUpdates = async () => {
    const update = await check();
    if (update) {
      setUpdateVersion(update.version);
      setOpenUpdateDialog(true);
      setUpdateState(update);
    } else {
      console.log('not found update');
    }
  };

  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        item.title.toLowerCase().includes(query),
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = (b.published_date || 0) - (a.published_date || 0);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'size':
          comparison = (b.size || 0) - (a.size || 0);
          break;
        default:
          comparison = 0;
      }
      return reverseSort ? -comparison : comparison;
    });

    return result;
  }, [items, searchQuery, sortBy, reverseSort]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = translations[language];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <UpdateDialog
        open={openUpdateDialog}
        onClickUpdate={handleUpdate}
        version={updateVersion}
        setOpen={setOpenUpdateDialog}
        l={language}
      />
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground">
              {activeRepo ? activeRepo.name : t.repositories}
            </h1>
            {activeRepo && (
              <>
                {activeRepo.description && (
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {activeRepo.description}
                  </p>
                )}
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  {activeRepo.author && (
                    <>
                      <span>
                        {t.author}: {activeRepo.author}
                      </span>
                      <span>•</span>
                    </>
                  )}
                  {activeRepo.version && (
                    <>
                      <span>
                        {language === 'ru' ? 'Версия' : 'Version'}:{' '}
                        {activeRepo.version}
                      </span>
                      <span>•</span>
                    </>
                  )}
                  <span>
                    {items.length} {getItemsLabel(items.length, language)}
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/favorites">
              <Button variant="ghost" size="icon">
                <Star className="h-5 w-5" />
                <span className="sr-only">{t.favorites}</span>
              </Button>
            </Link>
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/manager">
              <Button variant="outline" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">{t.settings}</span>
              </Button>
            </Link>
          </div>
        </div>
        {items.length > 0 ? (
          <>
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <SearchInput
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(value) => {
                    setSearchQuery(value);
                    scrollToTop();
                  }}
                  onClear={() => scrollToTop()}
                />
                <Select
                  value={sortBy}
                  onValueChange={(value: any) => {
                    setSortBy(value);
                    scrollToTop();
                  }}
                >
                  <SelectTrigger className="w-full sm:w-50">
                    <SelectValue placeholder={t.sorting} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">{t.sortByDate}</SelectItem>
                    <SelectItem value="title">{t.sortByTitle}</SelectItem>
                    <SelectItem value="size">{t.sortBySize}</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setReverseSort(!reverseSort);
                    scrollToTop();
                  }}
                  title={t.reverseSortOrder}
                >
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="sr-only">{t.reverseSortOrder}</span>
                </Button>
              </div>
            </div>
          </>
        ) : (
          ''
        )}
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-7">
          {items.length > 0 ? (
            <>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mb-4">
                  {t.found}: {filteredAndSortedItems.length}
                </p>
              )}

              <PosterGrid items={filteredAndSortedItems} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Settings className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">{t.noActiveRepo}</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                {t.addRepoDesc}
              </p>
              <Link href="/manager">
                <Button>{t.openManager}</Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-8 left-10 rounded-full shadow-lg z-50"
        >
          <ArrowUp className="h-5 w-5" />
          <span className="sr-only">{t.scrollToTop}</span>
        </Button>
      )}
    </div>
  );
}
