import { useState, useEffect } from "react";
import { bibleBooks } from "@/data/bible";
import BookCard from "@/components/BookCard";
import ChapterGrid from "@/components/ChapterGrid";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleVerses, loadFullBible, Verse } from "@/data/bibleVerses";

type View = 'books' | 'chapters' | 'reading';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('books');
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [allVerses, setAllVerses] = useState<Verse[]>(sampleVerses);
  const [chapterVerses, setChapterVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load full Bible in background
    setIsLoading(true);
    loadFullBible().then(verses => {
      if (verses.length > sampleVerses.length) {
        setAllVerses(verses);
        console.log(`Successfully loaded ${verses.length} verses`);
      }
      setIsLoading(false);
    }).catch(error => {
      console.error('Failed to load Bible:', error);
      setIsLoading(false);
    });
  }, []);

  const handleBookSelect = (bookId: number) => {
    setSelectedBook(bookId);
    setCurrentView('chapters');
  };

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
    setCurrentView('reading');
    
    // Load verses for the selected chapter
    if (selectedBook) {
      const verses = allVerses.filter(
        v => v.bookId === selectedBook && v.chapter === chapter
      );
      setChapterVerses(verses);
    }
  };

  const handleVerseSelect = (verse: Verse) => {
    setSelectedBook(verse.bookId);
    setSelectedChapter(verse.chapter);
    setCurrentView('reading');
    
    const verses = allVerses.filter(
      v => v.bookId === verse.bookId && v.chapter === verse.chapter
    );
    setChapterVerses(verses);
  };

  const handleBack = () => {
    if (currentView === 'reading') {
      setCurrentView('chapters');
      setSelectedChapter(null);
    } else if (currentView === 'chapters') {
      setCurrentView('books');
      setSelectedBook(null);
    }
  };

  const book = selectedBook ? bibleBooks.find(b => b.id === selectedBook) : null;
  const oldTestamentBooks = bibleBooks.filter(b => b.testament === 'old');
  const newTestamentBooks = bibleBooks.filter(b => b.testament === 'new');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border shadow-sm backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {currentView !== 'books' && (
              <Button
                onClick={handleBack}
                variant="ghost"
                size="icon"
                className="transition-transform duration-300 hover:scale-110"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            )}
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">
                {currentView === 'books' ? 'Holy Bible' : book?.name}
                {currentView === 'reading' && selectedChapter && ` Chapter ${selectedChapter}`}
              </h1>
            </div>
            
            {allVerses.length > 0 && (
              <SearchBar verses={allVerses} onVerseSelect={handleVerseSelect} />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'books' && (
          <Tabs defaultValue="old" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="old" className="text-lg">Old Testament</TabsTrigger>
              <TabsTrigger value="new" className="text-lg">New Testament</TabsTrigger>
            </TabsList>
            
            <TabsContent value="old" className="animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {oldTestamentBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onClick={() => handleBookSelect(book.id)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="new" className="animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {newTestamentBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onClick={() => handleBookSelect(book.id)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {currentView === 'chapters' && book && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
                Select a chapter
              </h2>
            </div>
            <ChapterGrid
              totalChapters={book.chapters}
              onChapterSelect={handleChapterSelect}
            />
          </div>
        )}

        {currentView === 'reading' && book && selectedChapter && (
          <div className="animate-fade-in max-w-3xl mx-auto">
            <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg border border-border">
              {chapterVerses.length > 0 ? (
                <div className="space-y-4">
                  {chapterVerses.map((verse) => (
                    <div key={verse.verse} className="flex gap-3">
                      <span className="text-sm font-semibold text-primary min-w-[2rem]">
                        {verse.verse}
                      </span>
                      <p className="text-base leading-relaxed text-foreground">
                        {verse.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic text-center">
                  Loading chapter...
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
