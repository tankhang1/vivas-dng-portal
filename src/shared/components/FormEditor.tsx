import React, { useEffect, useRef } from "react";
import { cn } from "./ui";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Quote,
  RemoveFormatting,
  FileUp,
} from "lucide-react";

type FormEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

function execCommand(command: string, value?: string) {
  if (typeof document === "undefined") return;
  document.execCommand(command, false, value);
}

/**
 * Some article content is a full HTML document (complete with its own
 * <style>/<script> tags) rather than a plain body fragment. Since the
 * editor is a contentEditable div living in the live page DOM, injecting
 * those tags as-is would leak page-wide (e.g. a <style> rule targeting
 * "h1" would restyle every h1 on the whole app, not just this editor).
 * Strip them and keep only the body content.
 */
function sanitizeHtml(html: string): string {
  if (typeof window === "undefined" || !html) return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script, style, link[rel='stylesheet']").forEach((el) => el.remove());
  return doc.body.innerHTML;
}

export function FormEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  className,
}: FormEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    const safeValue = sanitizeHtml(value);
    if (el.innerHTML !== safeValue) {
      el.innerHTML = safeValue;
    }
  }, [value]);

  const handleInput = () => {
    const html = editorRef.current?.innerHTML ?? "";
    onChange(html);
  };

  const handleAction = (command: string, promptMessage?: string) => {
    if (promptMessage) {
      const url = window.prompt(promptMessage);
      if (!url) return;
      execCommand(command, url);
    } else {
      execCommand(command);
    }
    editorRef.current?.focus();
    handleInput();
  };

  const handleInsertHtmlFileClick = () => fileInputRef.current?.click();

  const handleInsertHtmlFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const raw = typeof reader.result === "string" ? reader.result : "";
      const safeHtml = sanitizeHtml(raw);
      editorRef.current?.focus();
      execCommand("insertHTML", safeHtml);
      handleInput();
    };
    reader.readAsText(file);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-input bg-white",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-1 border-b border-input bg-muted/40 p-2">
        <ToolbarButton label="Đậm" onClick={() => handleAction("bold")}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Nghiêng" onClick={() => handleAction("italic")}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Gạch chân"
          onClick={() => handleAction("underline")}
        >
          <Underline className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Danh sách chấm"
          onClick={() => handleAction("insertUnorderedList")}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Danh sách số"
          onClick={() => handleAction("insertOrderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Trích dẫn"
          onClick={() => handleAction("formatBlock", "blockquote")}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Chèn link"
          onClick={() => handleAction("createLink", "Nhập URL liên kết")}
        >
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Xóa định dạng"
          onClick={() => handleAction("removeFormat")}
        >
          <RemoveFormatting className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Chèn tệp HTML"
          onClick={handleInsertHtmlFileClick}
        >
          <FileUp className="h-4 w-4" />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,text/html"
          className="hidden"
          onChange={handleInsertHtmlFile}
        />
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        className={cn(
          "min-h-[220px] px-4 py-3 text-sm leading-6 outline-none [&_a]:text-primary [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
          "empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]",
        )}
      />
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
    >
      {children}
    </button>
  );
}
