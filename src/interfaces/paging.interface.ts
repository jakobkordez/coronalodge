export interface Paging<T> {
  items: T[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}
