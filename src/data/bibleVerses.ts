export interface Verse {
  book: string;
  bookId: number;
  chapter: number;
  verse: number;
  text: string;
}

// Sample verses from Genesis for demonstration
// In production, this would be generated from the full Bible text
export const sampleVerses: Verse[] = [
  // Genesis 1
  { bookId: 1, book: "Genesis", chapter: 1, verse: 1, text: "In the beginning God created the heaven and the earth." },
  { bookId: 1, book: "Genesis", chapter: 1, verse: 2, text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters." },
  { bookId: 1, book: "Genesis", chapter: 1, verse: 3, text: "And God said, Let there be light: and there was light." },
  { bookId: 1, book: "Genesis", chapter: 1, verse: 4, text: "And God saw the light, that it was good: and God divided the light from the darkness." },
  { bookId: 1, book: "Genesis", chapter: 1, verse: 5, text: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day." },
  { bookId: 1, book: "Genesis", chapter: 1, verse: 26, text: "And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth." },
  { bookId: 1, book: "Genesis", chapter: 1, verse: 27, text: "So God created man in his own image, in the image of God created he him; male and female created he them." },
  { bookId: 1, book: "Genesis", chapter: 1, verse: 31, text: "And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day." },
  
  // Genesis 2
  { bookId: 1, book: "Genesis", chapter: 2, verse: 1, text: "Thus the heavens and the earth were finished, and all the host of them." },
  { bookId: 1, book: "Genesis", chapter: 2, verse: 7, text: "And the LORD God formed man of the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul." },
  
  // John 3
  { bookId: 43, book: "John", chapter: 3, verse: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
  
  // Psalms 23
  { bookId: 19, book: "Psalms", chapter: 23, verse: 1, text: "The LORD is my shepherd; I shall not want." },
  { bookId: 19, book: "Psalms", chapter: 23, verse: 4, text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me." },
];

interface BibleBookJSON {
  book: string;
  chapters: {
    chapter: string;
    verses: {
      verse: string;
      text: string;
    }[];
  }[];
}

// This would load the full Bible asynchronously
export async function loadFullBible(): Promise<Verse[]> {
  try {
    // For now, load Genesis
    const response = await fetch('/bible-data/Genesis.json');
    if (!response.ok) {
      console.warn('Could not load Bible data, using sample verses');
      return sampleVerses;
    }
    
    const data: BibleBookJSON = await response.json();
    const verses = parseJSONBook(data, 1); // Genesis is bookId 1
    console.log(`Loaded ${verses.length} verses from ${data.book}`);
    return verses;
  } catch (error) {
    console.error('Error loading Bible:', error);
    return sampleVerses;
  }
}

function parseJSONBook(bookData: BibleBookJSON, bookId: number): Verse[] {
  const verses: Verse[] = [];
  
  for (const chapterData of bookData.chapters) {
    const chapterNum = parseInt(chapterData.chapter);
    
    for (const verseData of chapterData.verses) {
      verses.push({
        book: bookData.book,
        bookId: bookId,
        chapter: chapterNum,
        verse: parseInt(verseData.verse),
        text: verseData.text
      });
    }
  }
  
  return verses;
}

