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

// Book name to ID mapping
const bookNameToId: { [key: string]: number } = {
  'Genesis': 1,
  '1 Samuel': 9,
  '2 Samuel': 10,
  '1 Kings': 11,
  '2 Kings': 12,
  '1 Chronicles': 13,
  '2 Chronicles': 14,
  'Amos': 30,
  'Acts': 44,
  '1 Corinthians': 46,
  '2 Corinthians': 47,
  'Colossians': 51,
  '1 Thessalonians': 52,
  '2 Thessalonians': 53,
  '1 Timothy': 54,
  '2 Timothy': 55,
  '1 Peter': 60,
  '2 Peter': 61,
  '1 John': 62,
  '2 John': 63,
  '3 John': 64,
};

// List of available Bible books (JSON files)
const availableBooks = [
  'Genesis',
  '1Samuel',
  '2Samuel',
  '1Kings',
  '2Kings',
  '1Chronicles',
  '2Chronicles',
  'Amos',
  'Acts',
  '1Corinthians',
  '2Corinthians',
  'Colossians',
  '1Thessalonians',
  '2Thessalonians',
  '1Timothy',
  '2Timothy',
  '1Peter',
  '2Peter',
  '1John',
  '2John',
  '3John',
];


// This would load the full Bible asynchronously
export async function loadFullBible(): Promise<Verse[]> {
  try {
    const allVerses: Verse[] = [];
    
    // Load all available books
    for (const bookFileName of availableBooks) {
      try {
        const response = await fetch(`/bible-data/${bookFileName}.json`);
        if (!response.ok) {
          console.warn(`Could not load ${bookFileName}`);
          continue;
        }
        
        const data: BibleBookJSON = await response.json();
        const bookId = bookNameToId[data.book] || 0;
        const verses = parseJSONBook(data, bookId);
        allVerses.push(...verses);
        console.log(`Loaded ${verses.length} verses from ${data.book}`);
      } catch (error) {
        console.error(`Error loading ${bookFileName}:`, error);
      }
    }
    
    if (allVerses.length === 0) {
      console.warn('No Bible data loaded, using sample verses');
      return sampleVerses;
    }
    
    console.log(`Total verses loaded: ${allVerses.length}`);
    return allVerses;
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

