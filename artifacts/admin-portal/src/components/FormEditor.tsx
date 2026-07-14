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

export function FormEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  className,
}: FormEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    if (el.innerHTML !== value) {
      el.innerHTML = value;
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
