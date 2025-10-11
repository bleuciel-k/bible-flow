import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Search } from "lucide-react";
import { Verse } from "@/utils/bibleParser";

interface SearchBarProps {
  verses: Verse[];
  onVerseSelect: (verse: Verse) => void;
}

const SearchBar = ({ verses, onVerseSelect }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Verse[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filteredResults = verses
      .filter(verse => 
        verse.text.toLowerCase().includes(lowerQuery) ||
        verse.book.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 20);

    setResults(filteredResults);
    setIsOpen(filteredResults.length > 0);
  }, [query, verses]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const groupedResults = results.reduce((acc, verse) => {
    const key = `${verse.book} ${verse.chapter}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(verse);
    return acc;
  }, {} as Record<string, Verse[]>);

  return (
    <div className="relative flex-1 max-w-md" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search verses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="pl-10 bg-background/50 backdrop-blur-sm border-border"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full max-w-2xl z-50">
          <Command className="rounded-2xl border border-border shadow-lg bg-card">
            <CommandList className="max-h-[400px]">
              {Object.keys(groupedResults).length === 0 ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : (
                Object.entries(groupedResults).map(([chapterKey, chapterVerses]) => (
                  <CommandGroup 
                    key={chapterKey}
                    heading={
                      <span className="text-base font-bold text-foreground">
                        {chapterKey}
                      </span>
                    }
                  >
                    {chapterVerses.map((verse) => (
                      <CommandItem
                        key={`${verse.bookId}-${verse.chapter}-${verse.verse}`}
                        onSelect={() => {
                          onVerseSelect(verse);
                          setIsOpen(false);
                          setQuery("");
                        }}
                        className="cursor-pointer py-3"
                      >
                        <div className="flex flex-col gap-1 w-full">
                          <span className="text-sm text-muted-foreground">
                            Verse {verse.verse}
                          </span>
                          <span className="text-sm text-foreground/80 line-clamp-2">
                            {verse.text}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
