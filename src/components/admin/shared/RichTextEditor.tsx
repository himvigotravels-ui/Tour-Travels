"use client";

import { useCallback } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExt from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { toast } from "sonner";
import {
  RiBold,
  RiItalic,
  RiUnderline,
  RiStrikethrough,
  RiH1,
  RiH2,
  RiH3,
  RiListUnordered,
  RiListOrdered,
  RiDoubleQuotesL,
  RiCodeLine,
  RiLinkM,
  RiLinkUnlinkM,
  RiImageAddLine,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiSeparator,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiEraserLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Cloudinary upload folder for inline images */
  imageFolder?: string;
  className?: string;
}

interface BtnProps {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

function ToolbarButton({ active, disabled, onClick, title, icon: Icon }: BtnProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition-colors",
        "hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent",
        active && "bg-slate-900 text-white hover:bg-slate-900"
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden />;
}

function Toolbar({
  editor,
  imageFolder,
}: {
  editor: Editor | null;
  imageFolder: string;
}) {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank", rel: "noopener noreferrer" })
      .run();
  }, [editor]);

  const insertImage = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", imageFolder);
      const t = toast.loading("Uploading image...");
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("upload failed");
        const data = await res.json();
        editor.chain().focus().setImage({ src: data.secure_url, alt: file.name }).run();
        toast.success("Image inserted", { id: t });
      } catch {
        toast.error("Image upload failed", { id: t });
      }
    };
    input.click();
  }, [editor, imageFolder]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50/80 p-2">
      <ToolbarButton
        title="Bold"
        icon={RiBold}
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        title="Italic"
        icon={RiItalic}
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        title="Underline"
        icon={RiUnderline}
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        title="Strikethrough"
        icon={RiStrikethrough}
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />

      <Divider />

      <ToolbarButton
        title="Heading 1"
        icon={RiH1}
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <ToolbarButton
        title="Heading 2"
        icon={RiH2}
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        title="Heading 3"
        icon={RiH3}
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />

      <Divider />

      <ToolbarButton
        title="Bullet list"
        icon={RiListUnordered}
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        title="Numbered list"
        icon={RiListOrdered}
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        title="Quote"
        icon={RiDoubleQuotesL}
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <ToolbarButton
        title="Code block"
        icon={RiCodeLine}
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />

      <Divider />

      <ToolbarButton
        title="Align left"
        icon={RiAlignLeft}
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      />
      <ToolbarButton
        title="Align centre"
        icon={RiAlignCenter}
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      />
      <ToolbarButton
        title="Align right"
        icon={RiAlignRight}
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      />

      <Divider />

      <ToolbarButton
        title={editor.isActive("link") ? "Edit link" : "Add link"}
        icon={RiLinkM}
        active={editor.isActive("link")}
        onClick={setLink}
      />
      <ToolbarButton
        title="Remove link"
        icon={RiLinkUnlinkM}
        disabled={!editor.isActive("link")}
        onClick={() => editor.chain().focus().unsetLink().run()}
      />
      <ToolbarButton title="Insert image" icon={RiImageAddLine} onClick={insertImage} />
      <ToolbarButton
        title="Horizontal rule"
        icon={RiSeparator}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />

      <Divider />

      <ToolbarButton
        title="Clear formatting"
        icon={RiEraserLine}
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      />
      <ToolbarButton
        title="Undo"
        icon={RiArrowGoBackLine}
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      />
      <ToolbarButton
        title="Redo"
        icon={RiArrowGoForwardLine}
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      />
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  imageFolder = "blogs",
  className,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
      }),
      Underline,
      LinkExt.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      ImageExt.configure({
        HTMLAttributes: { class: "rounded-xl" },
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-slate max-w-none min-h-[420px] px-5 py-4",
          "focus:outline-none",
          "prose-headings:font-outfit prose-headings:font-bold prose-headings:text-slate-900",
          "prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
          "prose-p:text-slate-700 prose-p:leading-relaxed",
          "prose-a:text-brand-orange hover:prose-a:text-brand-orange/80",
          "prose-strong:text-slate-900",
          "prose-img:rounded-xl prose-img:shadow-md",
          "prose-blockquote:border-brand-orange prose-blockquote:bg-amber-50/40 prose-blockquote:not-italic",
          "prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div
      className={cn(
        "rounded-lg border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring overflow-hidden",
        className
      )}
    >
      <Toolbar editor={editor} imageFolder={imageFolder} />
      <EditorContent editor={editor} />
    </div>
  );
}
