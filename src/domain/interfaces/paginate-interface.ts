export interface Paginate<T> {
  items: T[]
  pagination: {
    count: number
    limit: number
    currentPage: number
    pagesCount: number
  }
}
