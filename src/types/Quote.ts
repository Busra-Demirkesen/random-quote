export interface Quote {
  _id: string;
  quoteText: string;
  authorName: string;
  html: string;
  liked?: boolean;
}
