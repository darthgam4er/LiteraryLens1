export type Book = {
  id: number;
  title: string;
  author: string;
  summary: string;
  coverImage: string;
  genres: string[];
  themes: string[];
  rating: number;
  isbn: string;
  amazonLink: string;
};

export type Recommendation = Book & {
  explanation: string;
};

export const genres = [
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Thriller',
  'Romance',
  'Historical Fiction',
  'Horror',
  'Biography',
  'Non-Fiction',
  'Literary Fiction',
  'Adventure',
  'Dystopian'
];
