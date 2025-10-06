import { Button } from "@/components/ui/button";

interface ChapterGridProps {
  totalChapters: number;
  onChapterSelect: (chapter: number) => void;
}

const ChapterGrid = ({ totalChapters, onChapterSelect }: ChapterGridProps) => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
      {Array.from({ length: totalChapters }, (_, i) => i + 1).map((chapter) => (
        <Button
          key={chapter}
          onClick={() => onChapterSelect(chapter)}
          variant="outline"
          className="h-14 text-lg font-semibold transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground"
        >
          {chapter}
        </Button>
      ))}
    </div>
  );
};

export default ChapterGrid;
