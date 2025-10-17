import { Button } from "@/components/ui/button";

interface ChapterGridProps {
  totalChapters: number;
  onChapterSelect: (chapter: number) => void;
}

const ChapterGrid = ({ totalChapters, onChapterSelect }: ChapterGridProps) => {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
      {Array.from({ length: totalChapters }, (_, i) => i + 1).map((chapter) => (
        <Button
          key={chapter}
          onClick={() => onChapterSelect(chapter)}
          variant="outline"
          className="h-10 text-base font-semibold transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-primary-foreground"
        >
          {chapter}
        </Button>
      ))}
    </div>
  );
};

export default ChapterGrid;
