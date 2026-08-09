import { mockNews } from '../../data/mock';
import { normalizeArticle, type NewsArticle } from './types';

let newsState: NewsArticle[] = mockNews.map((item) =>
  normalizeArticle(item as Partial<NewsArticle>),
);

export function getNews() {
  return [...newsState];
}

export function getNewsById(id: string) {
  return newsState.find((item) => item.id === id) ?? null;
}

export function saveNews(article: NewsArticle) {
  const exists = newsState.some((item) => item.id === article.id);
  newsState = exists
    ? newsState.map((item) => (item.id === article.id ? article : item))
    : [article, ...newsState];
}

export function deleteNews(id: string) {
  newsState = newsState.filter((item) => item.id !== id);
}
