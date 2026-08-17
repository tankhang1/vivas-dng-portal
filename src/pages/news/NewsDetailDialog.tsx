import { useMemo, useRef, useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogFooter,
} from "../../shared/components/ui";
import { StatusBadge } from "./components/StatusBadge";
import {
  ArrowRight,
  CalendarDays,
  Link as LinkIcon,
  Newspaper,
  Paperclip,
  User2,
  X,
} from "lucide-react";
import {
  audienceLabel,
  formatDate,
  linkTypeLabel,
  sourceLabel,
  type NewsArticle,
} from "./types";

type NewsDetailDialogProps = {
  open: boolean;
  article: NewsArticle | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (id: string) => void;
  onDeactivate: (id: string) => void;
  onApprove: (id: string) => void;
};

const ARTICLE_BODY_STYLE = `
  body {
    margin: 0;
    padding: 24px 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif;
    font-size: 15px;
    line-height: 1.75;
    color: #1f2937;
  }
  img { max-width: 100%; height: auto; border-radius: 12px; }
  h1, h2, h3 { line-height: 1.35; color: #0f172a; }
  a { color: #2563eb; }
  p { margin: 0 0 1em; }
`;

export function NewsDetailDialog({
  open,
  article,
  onOpenChange,
  onEdit,
  onDeactivate,
  onApprove,
}: NewsDetailDialogProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(200);

  const srcDoc = useMemo(
    () =>
      `<!doctype html><html><head><style>${ARTICLE_BODY_STYLE}</style></head><body>${
        article?.contentHtml ?? ""
      }</body></html>`,
    [article?.contentHtml],
  );

  const handleIframeLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    if (doc?.documentElement) {
      setIframeHeight(doc.documentElement.scrollHeight);
    }
  };

  const initial = article?.source?.trim()?.[0]?.toUpperCase() || "?";

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="!max-w-4xl !p-0">
      {article && (
        <div className="flex max-h-[88vh] flex-col overflow-hidden rounded-lg bg-background">
          <div className="relative">
            {article.thumbnail[0]?.url ? (
              <div className="h-56 w-full overflow-hidden bg-slate-100 sm:h-72">
                <img
                  src={article.thumbnail[0].url}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-40 w-full items-center justify-center bg-slate-100 text-slate-300">
                <Newspaper className="h-10 w-10" />
              </div>
            )}
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 shadow-md"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="border-b border-border px-6 py-5">
              <div className="flex flex-wrap items-center gap-2">
                {article.categoryName && (
                  <Badge variant="outline" className="gap-1">
                    {article.categoryName}
                  </Badge>
                )}
                <StatusBadge status={article.status} />
              </div>
              <h1 className="mt-3 text-2xl font-bold leading-snug text-foreground">
                {article.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {initial}
                  </span>
                  {sourceLabel(article.source)}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(article.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <User2 className="h-3.5 w-3.5" />
                  {audienceLabel(article.audience)}
                </span>
              </div>
            </div>

            <div className="px-6 py-5">
              {article.shortDescription && (
                <p className="mb-4 text-base font-medium leading-7 text-foreground">
                  {article.shortDescription}
                </p>
              )}

              <iframe
                ref={iframeRef}
                title={article.title || "Nội dung bản tin"}
                srcDoc={srcDoc}
                onLoad={handleIframeLoad}
                sandbox=""
                className="w-full"
                style={{ height: iframeHeight }}
              />

              {(article.linkUrl || article.media.length > 0) && (
                <div className="mt-6 space-y-3 border-t border-border pt-5">
                  {article.linkType !== "none" && (
                    <div className="flex items-center gap-2 text-sm">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {linkTypeLabel(article.linkType)}:
                      </span>
                      {article.linkUrl ? (
                        <a
                          href={article.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all text-primary hover:underline"
                        >
                          {article.linkUrl}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">
                          Chưa gắn liên kết.
                        </span>
                      )}
                    </div>
                  )}

                  {article.media.length > 0 && (
                    <div className="space-y-2">
                      {article.media.map((file) => (
                        <a
                          key={file.id}
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 rounded-xl border bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100"
                        >
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <span className="min-w-0 flex-1 truncate">
                            {file.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="border-t border-border px-6 py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
            {article.status === "published" ? (
              <Button
                variant="outline"
                onClick={() => onDeactivate(article.id)}
              >
                Vô hiệu hóa
              </Button>
            ) : (
              <Button variant="outline" onClick={() => onApprove(article.id)}>
                Kích hoạt
              </Button>
            )}
            <Button onClick={() => onEdit(article.id)}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </DialogFooter>
        </div>
      )}
    </Dialog>
  );
}
