import type { NewsItem } from "@/features/news/types/get-news.response";
import type { NewsArticle } from "../types";

export function newsItemToArticle(item: NewsItem): NewsArticle {
  return {
    id: String(item.id),
    title: item.title,
    categoryName: item.category_name ?? "",
    status: item.status === 1 ? "published" : "draft",
    date: item.time_create,
    source: item.staff_name ?? "",
    media: [],
    thumbnail: item.thumbnail
      ? [{ id: `thumb-${item.id}`, name: item.title, url: item.thumbnail }]
      : [],
    shortDescription: item.short_describe ?? "",
    contentHtml: item.content ?? "",
    audience: "all-citizens",
    linkType: item.url ? "external" : "none",
    linkUrl: item.url ?? "",
  };
}
