import { Card } from "@/components/ui/card";
import { Book } from "@/data/bible";
import { ChevronRight } from "lucide-react";

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

const BookCard = ({ book, onClick }: BookCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-border bg-card"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-card-foreground mb-1">
            {book.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {book.chapters}개 장
          </p>
        </div>
        <ChevronRight className="w-6 h-6 text-primary transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Card>
  );
};

export default BookCard;
