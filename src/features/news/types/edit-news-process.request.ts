export type EditNewsProcessRequest = {
  news_item: number;
  category_item: number;
  category_name: string;
  thumbnail: string;
  title: string;
  star_index: number;
  path: string;
  url: string;
  short_describe: string;
  content: string;
};
