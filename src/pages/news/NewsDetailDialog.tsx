import { Badge, Button, Dialog, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui';
import { ArrowRight, CalendarDays, Globe, Link as LinkIcon, Paperclip, X } from 'lucide-react';
import { audienceLabel, categoryLabel, formatDate, linkTypeLabel, sourceLabel, type NewsArticle } from './types';

type NewsDetailDialogProps = {
  open: boolean;
  article: NewsArticle | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function NewsDetailDialog({
  open,
  article,
  onOpenChange,
  onEdit,
  onDelete,
}: NewsDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="!max-w-6xl !p-0">
      {article && (
        <div className="flex max-h-[88vh] flex-col overflow-hidden rounded-lg bg-background">
          <div className="border-b border-border px-6 py-5">
            <DialogHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{categoryLabel(article.category)}</span>
                    <span>•</span>
                    <span>{formatDate(article.date)}</span>
                  </div>
                  <DialogTitle className="mt-2 text-2xl leading-snug">
                    {article.title}
                  </DialogTitle>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {formatDate(article.date)}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Globe className="h-3 w-3" />
                      {article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <LinkIcon className="h-3 w-3" />
                      {linkTypeLabel(article.linkType)}
                    </Badge>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
          </div>

          <div className="grid min-h-0 gap-0 overflow-hidden lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="min-h-0 overflow-y-auto px-6 py-6">
              <article className="space-y-6">
                {article.thumbnail[0]?.url && (
                  <div className="overflow-hidden rounded-2xl border bg-slate-100">
                    <img
                      src={article.thumbnail[0].url}
                      alt={article.title}
                      className="max-h-[360px] w-full object-cover"
                    />
                  </div>
                )}

                {article.shortDescription && (
                  <p className="text-base leading-7 text-muted-foreground">
                    {article.shortDescription}
                  </p>
                )}

                <div
                  className="prose max-w-none prose-slate prose-headings:font-semibold prose-p:leading-7 prose-li:leading-7"
                  dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                />
              </article>
            </div>

            <div className="border-l border-border bg-slate-50 px-6 py-6">
              <div className="space-y-5">
                <section className="rounded-2xl border bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Thông tin bài viết
                  </p>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-muted-foreground">Nguồn tin</dt>
                      <dd className="text-right font-medium">{sourceLabel(article.source)}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-muted-foreground">Danh mục</dt>
                      <dd className="text-right font-medium">{categoryLabel(article.category)}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-muted-foreground">Đối tượng</dt>
                      <dd className="text-right font-medium">{audienceLabel(article.audience)}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-muted-foreground">Trạng thái</dt>
                      <dd className="text-right font-medium">
                        {article.status === 'published' ? 'Xuất bản' : 'Lưu nháp'}
                      </dd>
                    </div>
                  </dl>
                </section>

                <section className="rounded-2xl border bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Liên kết
                  </p>
                  <div className="mt-3 space-y-2 text-sm">
                    <p className="font-medium">{linkTypeLabel(article.linkType)}</p>
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
                      <p className="text-muted-foreground">Chưa gắn liên kết.</p>
                    )}
                  </div>
                </section>

                {article.media.length > 0 && (
                  <section className="rounded-2xl border bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Tệp đính kèm
                    </p>
                    <div className="mt-3 space-y-2">
                      {article.media.map((file) => (
                        <a
                          key={file.id}
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 rounded-xl border bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100"
                        >
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <span className="min-w-0 flex-1 truncate">{file.name}</span>
                        </a>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-border px-6 py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
            <Button variant="outline" onClick={() => onDelete(article.id)}>
              Xóa
            </Button>
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
