export interface Paginated<T> {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}
