import { useState } from "react";
import { bibleBooks } from "@/data/bible";
import BookCard from "@/components/BookCard";
import ChapterGrid from "@/components/ChapterGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type View = 'books' | 'chapters' | 'reading';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('books');
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  const handleBookSelect = (bookId: number) => {
    setSelectedBook(bookId);
    setCurrentView('chapters');
  };

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
    setCurrentView('reading');
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
                {currentView === 'books' ? '성경' : book?.name}
                {currentView === 'reading' && selectedChapter && ` ${selectedChapter}장`}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'books' && (
          <Tabs defaultValue="old" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="old" className="text-lg">구약</TabsTrigger>
              <TabsTrigger value="new" className="text-lg">신약</TabsTrigger>
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
                읽으실 장을 선택하세요
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
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-foreground mb-6">
                  성경 본문이 여기에 표시됩니다.
                </p>
                <p className="text-muted-foreground italic">
                  실제 성경 데이터를 연동하려면 Bible API를 사용하거나 데이터베이스를 추가해야 합니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
