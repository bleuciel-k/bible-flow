export interface Verse {
  book: string;
  bookId: number;
  chapter: number;
  verse: number;
  text: string;
}

export interface ParsedBibleData {
  verses: Verse[];
  chaptersByBook: Map<number, Map<number, Verse[]>>;
}

const bookNameMapping: Record<string, number> = {
  "GENESIS": 1,
  "EXODUS": 2,
  "LEVITICUS": 3,
  "NUMBERS": 4,
  "DEUTERONOMY": 5,
  "JOSHUA": 6,
  "JUDGES": 7,
  "RUTH": 8,
  "1 SAMUEL": 9,
  "2 SAMUEL": 10,
  "1 KINGS": 11,
  "2 KINGS": 12,
  "1 CHRONICLES": 13,
  "2 CHRONICLES": 14,
  "EZRA": 15,
  "NEHEMIAH": 16,
  "ESTHER": 17,
  "JOB": 18,
  "PSALMS": 19,
  "PROVERBS": 20,
  "ECCLESIASTES": 21,
  "SONG OF SOLOMON": 22,
  "ISAIAH": 23,
  "JEREMIAH": 24,
  "LAMENTATIONS": 25,
  "EZEKIEL": 26,
  "DANIEL": 27,
  "HOSEA": 28,
  "JOEL": 29,
  "AMOS": 30,
  "OBADIAH": 31,
  "JONAH": 32,
  "MICAH": 33,
  "NAHUM": 34,
  "HABAKKUK": 35,
  "ZEPHANIAH": 36,
  "HAGGAI": 37,
  "ZECHARIAH": 38,
  "MALACHI": 39,
  "MATTHEW": 40,
  "MARK": 41,
  "LUKE": 42,
  "JOHN": 43,
  "ACTS": 44,
  "ROMANS": 45,
  "1 CORINTHIANS": 46,
  "2 CORINTHIANS": 47,
  "GALATIANS": 48,
  "EPHESIANS": 49,
  "PHILIPPIANS": 50,
  "COLOSSIANS": 51,
  "1 THESSALONIANS": 52,
  "2 THESSALONIANS": 53,
  "1 TIMOTHY": 54,
  "2 TIMOTHY": 55,
  "TITUS": 56,
  "PHILEMON": 57,
  "HEBREWS": 58,
  "JAMES": 59,
  "1 PETER": 60,
  "2 PETER": 61,
  "1 JOHN": 62,
  "2 JOHN": 63,
  "3 JOHN": 64,
  "JUDE": 65,
  "REVELATION": 66
};

export async function parseBibleText(): Promise<ParsedBibleData> {
  try {
    const response = await fetch('/bible-text.txt');
    if (!response.ok) throw new Error('Failed to load Bible text');
    const text = await response.text();
  const lines = text.split('\n');
  
  const verses: Verse[] = [];
  const chaptersByBook = new Map<number, Map<number, Verse[]>>();
  
  let currentBookName = '';
  let currentBookId = 0;
  let currentChapter = 0;
  
  for (const line of lines) {
    // Skip empty lines
    if (!line.trim()) continue;
    
    // Check for book names
    if (line.includes('GENESIS') || line.includes('FIRST BOOK OF MOSES')) {
      currentBookName = 'Genesis';
      currentBookId = 1;
    } else if (line.includes('EXODUS') || line.includes('SECOND BOOK OF MOSES')) {
      currentBookName = 'Exodus';
      currentBookId = 2;
    } else if (line.includes('LEVITICUS') || line.includes('THIRD BOOK OF MOSES')) {
      currentBookName = 'Leviticus';
      currentBookId = 3;
    } else if (line.includes('NUMBERS') || line.includes('FOURTH BOOK OF MOSES')) {
      currentBookName = 'Numbers';
      currentBookId = 4;
    } else if (line.includes('DEUTERONOMY') || line.includes('FIFTH BOOK OF MOSES')) {
      currentBookName = 'Deuteronomy';
      currentBookId = 5;
    } else if (line.includes('JOSHUA')) {
      currentBookName = 'Joshua';
      currentBookId = 6;
    } else if (line.includes('JUDGES')) {
      currentBookName = 'Judges';
      currentBookId = 7;
    } else if (line.includes('RUTH')) {
      currentBookName = 'Ruth';
      currentBookId = 8;
    } else if (line.includes('1 SAMUEL') || line.includes('FIRST BOOK OF SAMUEL')) {
      currentBookName = '1 Samuel';
      currentBookId = 9;
    } else if (line.includes('2 SAMUEL') || line.includes('SECOND BOOK OF SAMUEL')) {
      currentBookName = '2 Samuel';
      currentBookId = 10;
    } else if (line.includes('1 KINGS') || line.includes('FIRST BOOK OF THE KINGS')) {
      currentBookName = '1 Kings';
      currentBookId = 11;
    } else if (line.includes('2 KINGS') || line.includes('SECOND BOOK OF THE KINGS')) {
      currentBookName = '2 Kings';
      currentBookId = 12;
    } else if (line.includes('1 CHRONICLES') || line.includes('FIRST BOOK OF THE CHRONICLES')) {
      currentBookName = '1 Chronicles';
      currentBookId = 13;
    } else if (line.includes('2 CHRONICLES') || line.includes('SECOND BOOK OF THE CHRONICLES')) {
      currentBookName = '2 Chronicles';
      currentBookId = 14;
    } else if (line.includes('EZRA')) {
      currentBookName = 'Ezra';
      currentBookId = 15;
    } else if (line.includes('NEHEMIAH')) {
      currentBookName = 'Nehemiah';
      currentBookId = 16;
    } else if (line.includes('ESTHER')) {
      currentBookName = 'Esther';
      currentBookId = 17;
    } else if (line.includes('JOB')) {
      currentBookName = 'Job';
      currentBookId = 18;
    } else if (line.includes('PSALM')) {
      currentBookName = 'Psalms';
      currentBookId = 19;
    } else if (line.includes('PROVERBS')) {
      currentBookName = 'Proverbs';
      currentBookId = 20;
    } else if (line.includes('ECCLESIASTES')) {
      currentBookName = 'Ecclesiastes';
      currentBookId = 21;
    } else if (line.includes('SONG OF SOLOMON') || line.includes('CANTICLES')) {
      currentBookName = 'Song of Solomon';
      currentBookId = 22;
    } else if (line.includes('ISAIAH')) {
      currentBookName = 'Isaiah';
      currentBookId = 23;
    } else if (line.includes('JEREMIAH') && !line.includes('LAMENTATIONS')) {
      currentBookName = 'Jeremiah';
      currentBookId = 24;
    } else if (line.includes('LAMENTATIONS')) {
      currentBookName = 'Lamentations';
      currentBookId = 25;
    } else if (line.includes('EZEKIEL')) {
      currentBookName = 'Ezekiel';
      currentBookId = 26;
    } else if (line.includes('DANIEL')) {
      currentBookName = 'Daniel';
      currentBookId = 27;
    } else if (line.includes('HOSEA')) {
      currentBookName = 'Hosea';
      currentBookId = 28;
    } else if (line.includes('JOEL')) {
      currentBookName = 'Joel';
      currentBookId = 29;
    } else if (line.includes('AMOS')) {
      currentBookName = 'Amos';
      currentBookId = 30;
    } else if (line.includes('OBADIAH')) {
      currentBookName = 'Obadiah';
      currentBookId = 31;
    } else if (line.includes('JONAH')) {
      currentBookName = 'Jonah';
      currentBookId = 32;
    } else if (line.includes('MICAH')) {
      currentBookName = 'Micah';
      currentBookId = 33;
    } else if (line.includes('NAHUM')) {
      currentBookName = 'Nahum';
      currentBookId = 34;
    } else if (line.includes('HABAKKUK')) {
      currentBookName = 'Habakkuk';
      currentBookId = 35;
    } else if (line.includes('ZEPHANIAH')) {
      currentBookName = 'Zephaniah';
      currentBookId = 36;
    } else if (line.includes('HAGGAI')) {
      currentBookName = 'Haggai';
      currentBookId = 37;
    } else if (line.includes('ZECHARIAH')) {
      currentBookName = 'Zechariah';
      currentBookId = 38;
    } else if (line.includes('MALACHI')) {
      currentBookName = 'Malachi';
      currentBookId = 39;
    } else if (line.includes('MATTHEW')) {
      currentBookName = 'Matthew';
      currentBookId = 40;
    } else if (line.includes('MARK')) {
      currentBookName = 'Mark';
      currentBookId = 41;
    } else if (line.includes('LUKE')) {
      currentBookName = 'Luke';
      currentBookId = 42;
    } else if (line.includes('JOHN') && !line.includes('1') && !line.includes('2') && !line.includes('3')) {
      currentBookName = 'John';
      currentBookId = 43;
    } else if (line.includes('ACTS')) {
      currentBookName = 'Acts';
      currentBookId = 44;
    } else if (line.includes('ROMANS')) {
      currentBookName = 'Romans';
      currentBookId = 45;
    } else if (line.includes('1 CORINTHIANS')) {
      currentBookName = '1 Corinthians';
      currentBookId = 46;
    } else if (line.includes('2 CORINTHIANS')) {
      currentBookName = '2 Corinthians';
      currentBookId = 47;
    } else if (line.includes('GALATIANS')) {
      currentBookName = 'Galatians';
      currentBookId = 48;
    } else if (line.includes('EPHESIANS')) {
      currentBookName = 'Ephesians';
      currentBookId = 49;
    } else if (line.includes('PHILIPPIANS')) {
      currentBookName = 'Philippians';
      currentBookId = 50;
    } else if (line.includes('COLOSSIANS')) {
      currentBookName = 'Colossians';
      currentBookId = 51;
    } else if (line.includes('1 THESSALONIANS')) {
      currentBookName = '1 Thessalonians';
      currentBookId = 52;
    } else if (line.includes('2 THESSALONIANS')) {
      currentBookName = '2 Thessalonians';
      currentBookId = 53;
    } else if (line.includes('1 TIMOTHY')) {
      currentBookName = '1 Timothy';
      currentBookId = 54;
    } else if (line.includes('2 TIMOTHY')) {
      currentBookName = '2 Timothy';
      currentBookId = 55;
    } else if (line.includes('TITUS')) {
      currentBookName = 'Titus';
      currentBookId = 56;
    } else if (line.includes('PHILEMON')) {
      currentBookName = 'Philemon';
      currentBookId = 57;
    } else if (line.includes('HEBREWS')) {
      currentBookName = 'Hebrews';
      currentBookId = 58;
    } else if (line.includes('JAMES')) {
      currentBookName = 'James';
      currentBookId = 59;
    } else if (line.includes('1 PETER')) {
      currentBookName = '1 Peter';
      currentBookId = 60;
    } else if (line.includes('2 PETER')) {
      currentBookName = '2 Peter';
      currentBookId = 61;
    } else if (line.includes('1 JOHN')) {
      currentBookName = '1 John';
      currentBookId = 62;
    } else if (line.includes('2 JOHN')) {
      currentBookName = '2 John';
      currentBookId = 63;
    } else if (line.includes('3 JOHN')) {
      currentBookName = '3 John';
      currentBookId = 64;
    } else if (line.includes('JUDE')) {
      currentBookName = 'Jude';
      currentBookId = 65;
    } else if (line.includes('REVELATION')) {
      currentBookName = 'Revelation';
      currentBookId = 66;
    }
    
    // Check for chapter
    const chapterMatch = line.match(/^CHAPTER (\d+)$/);
    if (chapterMatch) {
      currentChapter = parseInt(chapterMatch[1]);
      continue;
    }
    
    // Check for psalm chapter (e.g., "PSALM 1")
    const psalmMatch = line.match(/^PSALM (\d+)$/);
    if (psalmMatch) {
      currentChapter = parseInt(psalmMatch[1]);
      continue;
    }
    
    // Parse verse
    const verseMatch = line.match(/^(\d+)\s+(.+)$/);
    if (verseMatch && currentBookId > 0 && currentChapter > 0) {
      const verseNum = parseInt(verseMatch[1]);
      const verseText = verseMatch[2].trim();
      
      const verse: Verse = {
        book: currentBookName,
        bookId: currentBookId,
        chapter: currentChapter,
        verse: verseNum,
        text: verseText
      };
      
      verses.push(verse);
      
      // Add to chaptersByBook map
      if (!chaptersByBook.has(currentBookId)) {
        chaptersByBook.set(currentBookId, new Map());
      }
      const bookChapters = chaptersByBook.get(currentBookId)!;
      if (!bookChapters.has(currentChapter)) {
        bookChapters.set(currentChapter, []);
      }
      bookChapters.get(currentChapter)!.push(verse);
    }
  }
  
  return { verses, chaptersByBook };
  } catch (error) {
    console.error('Error parsing Bible text:', error);
    return { verses: [], chaptersByBook: new Map() };
  }
}

export function searchVerses(verses: Verse[], query: string): Verse[] {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return verses.filter(verse => 
    verse.text.toLowerCase().includes(lowerQuery) ||
    verse.book.toLowerCase().includes(lowerQuery)
  ).slice(0, 50); // Limit to 50 results
}
