import React, { useEffect, useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";

type Recipe = {
  slug: string;
  title: string;
  description?: string;
  heroImage?: string;
  tags?: string[];
  ingredients?: string[];
  steps?: string[];
};

function useDebounced<T>(value: T, ms = 200) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

export default function InstantSearch({
  dataUrl = "/api/recipes.json",
}: {
  dataUrl?: string;
}) {
  const [all, setAll] = useState<Recipe[] | null>(null);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") ?? "";
    setQuery(q);
  }, []);

  useEffect(() => {
    let alive = true;
    fetch(dataUrl)
      .then((r) => r.json())
      .then((items: Recipe[]) => {
        if (alive) setAll(items);
      })
      .catch(() => setAll([]));
    return () => {
      alive = false;
    };
  }, [dataUrl]);

  const debounced = useDebounced(query, 200);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (debounced) params.set("q", debounced);
    else params.delete("q");
    const next = `${location.pathname}${params.toString() ? `?${params}` : ""}`;
    history.replaceState(null, "", next);
    document.title = debounced ? `Search: ${debounced}` : "Search";
  }, [debounced]);

  const results = useMemo(() => {
    if (!all) return null;
    const q = debounced.trim().toLowerCase();
    if (!q) return [];
    return all.filter((r) => {
      const hay = [
        r.title,
        r.description,
        ...(r.tags || []),
        ...(r.ingredients || []),
        ...(r.steps || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [all, debounced]);

  const heading = debounced
    ? `Search results for “${debounced}”`
    : "Search results";

  return (
    <div className="container space-y-6 mt-10">
      {/* Search bar */}
      <div className="relative sm:max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
        <input
          className="input pl-10 pt-1 pb-1 pr-4 w-full rounded-md border bg-background text-foreground placeholder:text-muted-foreground transition-shadow focus:shadow-md focus:ring-2 focus:ring-primary/50 focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes..."
          aria-label="Search recipes"
        />
      </div>

      {/* Heading */}
      <h1 className="h1">{heading}</h1>

      {/* States */}
      {!all ? (
        <p className="muted">Loading…</p>
      ) : !debounced ? (
        <p className="muted">Type above to search.</p>
      ) : results && results.length === 0 ? (
        <p className="muted">No recipes found.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results!.map((r) => (
            <li key={r.slug} className="card">
              {r.heroImage && (
                <img src={r.heroImage} alt={r.title} loading="lazy" />
              )}
              <div className="card-body">
                <a href={`/recipes/${r.slug}/`} className="link">
                  {r.title}
                </a>
                {r.description && (
                  <p className="mt-2 text-sm text-neutral-600 line-clamp-3">
                    {r.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
