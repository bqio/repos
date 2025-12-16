"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Trash2,
  Upload,
  ExternalLink,
  Check,
  BookOpen,
  Cloud,
  FileX,
  OctagonX,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import type { Repository } from "@/types/repository";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { translations, getItemsLabel, type Language } from "@/lib/i18n";

function makeid(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default function ManagerPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [activeRepoId, setActiveRepoId] = useState<string | null>(null);
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const repos = JSON.parse(localStorage.getItem("repositories") || "[]");
    const activeId = localStorage.getItem("activeRepositoryId");
    setRepositories(repos);
    setActiveRepoId(activeId);

    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    const handleLanguageChange = (e: CustomEvent<Language>) => {
      setLanguage(e.detail);
    };
    window.addEventListener(
      "languageChange",
      handleLanguageChange as EventListener
    );
    return () =>
      window.removeEventListener(
        "languageChange",
        handleLanguageChange as EventListener
      );
  }, []);

  const clearSettings = async () => {
    localStorage.clear();
    location.href = "/";
  };

  const saveRepositories = (repos: Repository[]) => {
    localStorage.setItem("repositories", JSON.stringify(repos));
    setRepositories(repos);
  };

  const checkDuplicateRepository = (
    name: string,
    version?: string
  ): boolean => {
    return repositories.some(
      (repo) => repo.name === name && repo.version === version
    );
  };

  const addRepositoryByUrl = async () => {
    if (!newRepoUrl.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(newRepoUrl);
      const data = await response.json();

      if (data.name == "" || data.version == "" || data.items.length == 0) {
        toast({
          title: translations[language].error,
          description: translations[language].repoNotValid,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const newRepo: Repository = {
        id: makeid(10),
        name: data.name || translations[language].repositories,
        author: data.author,
        description: data.description,
        version: data.version,
        items: data.items || [],
        sourceUrl: newRepoUrl.trim(), // Save source URL for auto-update checking
      };

      if (checkDuplicateRepository(newRepo.name, newRepo.version)) {
        toast({
          title: translations[language].error,
          description: translations[language].errorDuplicateRepo,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const updatedRepos = [...repositories, newRepo];
      saveRepositories(updatedRepos);

      if (!activeRepoId) {
        localStorage.setItem("activeRepositoryId", newRepo.id);
        setActiveRepoId(newRepo.id);
      }

      setNewRepoUrl("");
      toast({
        title: translations[language].repoAdded,
        description: `${newRepo.name} ${translations[language].repoAddedDesc}`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: translations[language].error,
        description: translations[language].errorLoadRepo,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addRepositoryByFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        if (data.name == "" || data.version == "" || data.items.length == 0) {
          toast({
            title: translations[language].error,
            description: translations[language].repoNotValid,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const newRepo: Repository = {
          id: makeid(10),
          name: data.name || file.name.replace(".json", ""),
          author: data.author,
          description: data.description,
          version: data.version,
          items: data.items || [],
        };

        if (checkDuplicateRepository(newRepo.name, newRepo.version)) {
          toast({
            title: translations[language].error,
            description: translations[language].errorDuplicateRepo,
            variant: "destructive",
          });
          return;
        }

        const updatedRepos = [...repositories, newRepo];
        saveRepositories(updatedRepos);

        if (!activeRepoId) {
          localStorage.setItem("activeRepositoryId", newRepo.id);
          setActiveRepoId(newRepo.id);
        }

        toast({
          title: translations[language].repoAdded,
          description: `${newRepo.name} ${translations[language].repoAddedDesc}`,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: translations[language].error,
          description: translations[language].errorLoadRepo,
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const deleteRepository = (id: string) => {
    const updatedRepos = repositories.filter((r) => r.id !== id);
    saveRepositories(updatedRepos);

    if (activeRepoId === id) {
      const newActiveId = updatedRepos[0]?.id || null;
      localStorage.setItem("activeRepositoryId", newActiveId || "");
      setActiveRepoId(newActiveId);
    }

    toast({
      title: translations[language].repoDeleted,
      description: translations[language].repoDeletedDesc,
    });
  };

  const setActiveRepository = (id: string) => {
    localStorage.setItem("activeRepositoryId", id);
    setActiveRepoId(id);
    toast({
      title: translations[language].repoActivated,
      description: translations[language].repoActivatedDesc,
    });
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">{t.back}</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{t.repositoryManager}</h1>
          <div className="ml-auto flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t.addRepository}</h2>
            <Link href="/instructions">
              <Button variant="ghost" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                {t.instructions}
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={t.repoUrl}
                value={newRepoUrl}
                onChange={(e) => setNewRepoUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addRepositoryByUrl()}
              />
              <Button onClick={addRepositoryByUrl} disabled={isLoading}>
                <ExternalLink className="h-4 w-4 mr-2" />
                {t.add}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {t.or}
                </span>
              </div>
            </div>

            <div>
              <input
                type="file"
                accept=".json"
                onChange={addRepositoryByFile}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  asChild
                >
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {t.uploadJson}
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </Card>

        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold">
            {t.repositories} ({repositories.length})
          </h2>

          {repositories.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">{t.noRepos}</p>
            </Card>
          ) : (
            repositories.map((repo) => (
              <Card
                key={repo.id}
                className={`p-4 ${
                  activeRepoId === repo.id ? "border-primary" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{repo.name}</h3>
                      {activeRepoId === repo.id && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          {t.active}
                        </span>
                      )}
                      {repo.sourceUrl ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-xs">
                          <Cloud className="h-3 w-3 mr-1" />
                          {t.remote}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-900/20 text-red-700 dark:text-red-400 text-xs">
                          <FileX className="h-3 w-3 mr-1" />
                          {t.local}
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {repo.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      {repo.author && (
                        <>
                          <span>
                            {t.author}: {repo.author}
                          </span>
                          <span>•</span>
                        </>
                      )}
                      {repo.version && (
                        <>
                          <span>
                            {language === "ru" ? "Версия" : "Version"}:{" "}
                            {repo.version}
                          </span>
                          <span>•</span>
                        </>
                      )}
                      <span>
                        {repo.items?.length || 0}{" "}
                        {getItemsLabel(repo.items?.length || 0, language)}
                      </span>
                    </div>
                    {repo.sourceUrl && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                        <span className="font-medium">{t.source}:</span>
                        <a
                          href={repo.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate hover:text-primary transition-colors underline decoration-dotted"
                        >
                          {repo.sourceUrl}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {activeRepoId !== repo.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveRepository(repo.id)}
                      >
                        {t.activate}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteRepository(repo.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">{t.delete}</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold">{t.otherTitle}</h2>
          <Card className="p-8 text-center">
            <label htmlFor="">
              <Button className="w-full" asChild onClick={clearSettings}>
                <span>
                  <OctagonX className="h-4 w-4 mr-2" />
                  {t.clearButtonText}
                </span>
              </Button>
            </label>
            <p className="text-muted-foreground">{t.clearWarning}</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
