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

// This would load the full Bible asynchronously
export async function loadFullBible(): Promise<Verse[]> {
  try {
    const response = await fetch('/bible-text.txt');
    if (!response.ok) {
      console.warn('Could not load full Bible text, using sample verses');
      return sampleVerses;
    }
    
    const text = await response.text();
    const verses = parseBibleText(text);
    console.log(`Loaded ${verses.length} verses from Bible`);
    return verses;
  } catch (error) {
    console.error('Error loading Bible:', error);
    return sampleVerses;
  }
}

function parseBibleText(text: string): Verse[] {
  const lines = text.split('\n');
  const verses: Verse[] = [];
  
  let currentBookName = '';
  let currentBookId = 0;
  let currentChapter = 0;
  
  const bookPatterns: [RegExp, string, number][] = [
    [/FIRST BOOK OF MOSES|^GENESIS$/i, 'Genesis', 1],
    [/SECOND BOOK OF MOSES|^EXODUS$/i, 'Exodus', 2],
    [/THIRD BOOK OF MOSES|^LEVITICUS$/i, 'Leviticus', 3],
    [/FOURTH BOOK OF MOSES|^NUMBERS$/i, 'Numbers', 4],
    [/FIFTH BOOK OF MOSES|^DEUTERONOMY$/i, 'Deuteronomy', 5],
    [/^JOSHUA$/i, 'Joshua', 6],
    [/^JUDGES$/i, 'Judges', 7],
    [/^RUTH$/i, 'Ruth', 8],
    [/FIRST.*SAMUEL|^1 SAMUEL$/i, '1 Samuel', 9],
    [/SECOND.*SAMUEL|^2 SAMUEL$/i, '2 Samuel', 10],
    [/FIRST.*KINGS|^1 KINGS$/i, '1 Kings', 11],
    [/SECOND.*KINGS|^2 KINGS$/i, '2 Kings', 12],
    [/FIRST.*CHRONICLES|^1 CHRONICLES$/i, '1 Chronicles', 13],
    [/SECOND.*CHRONICLES|^2 CHRONICLES$/i, '2 Chronicles', 14],
    [/^EZRA$/i, 'Ezra', 15],
    [/^NEHEMIAH$/i, 'Nehemiah', 16],
    [/^ESTHER$/i, 'Esther', 17],
    [/^JOB$/i, 'Job', 18],
    [/^PSALM/i, 'Psalms', 19],
    [/^PROVERBS$/i, 'Proverbs', 20],
    [/^ECCLESIASTES$/i, 'Ecclesiastes', 21],
    [/SONG OF SOLOMON|CANTICLES/i, 'Song of Solomon', 22],
    [/^ISAIAH$/i, 'Isaiah', 23],
    [/^JEREMIAH$/i, 'Jeremiah', 24],
    [/LAMENTATIONS/i, 'Lamentations', 25],
    [/^EZEKIEL$/i, 'Ezekiel', 26],
    [/^DANIEL$/i, 'Daniel', 27],
    [/^HOSEA$/i, 'Hosea', 28],
    [/^JOEL$/i, 'Joel', 29],
    [/^AMOS$/i, 'Amos', 30],
    [/^OBADIAH$/i, 'Obadiah', 31],
    [/^JONAH$/i, 'Jonah', 32],
    [/^MICAH$/i, 'Micah', 33],
    [/^NAHUM$/i, 'Nahum', 34],
    [/^HABAKKUK$/i, 'Habakkuk', 35],
    [/^ZEPHANIAH$/i, 'Zephaniah', 36],
    [/^HAGGAI$/i, 'Haggai', 37],
    [/^ZECHARIAH$/i, 'Zechariah', 38],
    [/^MALACHI$/i, 'Malachi', 39],
    [/^MATTHEW$/i, 'Matthew', 40],
    [/^MARK$/i, 'Mark', 41],
    [/^LUKE$/i, 'Luke', 42],
    [/^JOHN$/i, 'John', 43],
    [/^ACTS$/i, 'Acts', 44],
    [/^ROMANS$/i, 'Romans', 45],
    [/^1 CORINTHIANS$/i, '1 Corinthians', 46],
    [/^2 CORINTHIANS$/i, '2 Corinthians', 47],
    [/^GALATIANS$/i, 'Galatians', 48],
    [/^EPHESIANS$/i, 'Ephesians', 49],
    [/^PHILIPPIANS$/i, 'Philippians', 50],
    [/^COLOSSIANS$/i, 'Colossians', 51],
    [/^1 THESSALONIANS$/i, '1 Thessalonians', 52],
    [/^2 THESSALONIANS$/i, '2 Thessalonians', 53],
    [/^1 TIMOTHY$/i, '1 Timothy', 54],
    [/^2 TIMOTHY$/i, '2 Timothy', 55],
    [/^TITUS$/i, 'Titus', 56],
    [/^PHILEMON$/i, 'Philemon', 57],
    [/^HEBREWS$/i, 'Hebrews', 58],
    [/^JAMES$/i, 'James', 59],
    [/^1 PETER$/i, '1 Peter', 60],
    [/^2 PETER$/i, '2 Peter', 61],
    [/^1 JOHN$/i, '1 John', 62],
    [/^2 JOHN$/i, '2 John', 63],
    [/^3 JOHN$/i, '3 John', 64],
    [/^JUDE$/i, 'Jude', 65],
    [/REVELATION/i, 'Revelation', 66],
  ];
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    // Check for book names
    for (const [pattern, name, id] of bookPatterns) {
      if (pattern.test(line)) {
        currentBookName = name;
        currentBookId = id;
        break;
      }
    }
    
    // Check for chapter
    const chapterMatch = line.match(/^(?:CHAPTER|PSALM)\s+(\d+)$/);
    if (chapterMatch) {
      currentChapter = parseInt(chapterMatch[1]);
      continue;
    }
    
    // Parse verse
    const verseMatch = line.match(/^(\d+)\s+(.+)$/);
    if (verseMatch && currentBookId > 0 && currentChapter > 0) {
      const verseNum = parseInt(verseMatch[1]);
      const verseText = verseMatch[2].trim();
      
      verses.push({
        book: currentBookName,
        bookId: currentBookId,
        chapter: currentChapter,
        verse: verseNum,
        text: verseText
      });
    }
  }
  
  return verses;
}
