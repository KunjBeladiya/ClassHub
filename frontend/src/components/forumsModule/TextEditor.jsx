import React, { useEffect } from "react";

import {
  ArrowLeft,
  Send,
  X,
  BookOpen,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Trash2,
  Code
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import CodeBlock from "@tiptap/extension-code-block";

export const TextEditor = ({ formData, setReplyContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      UnderlineExtension,
      Heading.configure({
        levels: [1, 2],
      }),
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      CodeBlock,
    ],
    content: "<p></p>",
    editorProps: {
      attributes: {
        class: "min-h-[150px] focus:outline-none",
        spellCheck: "true", // Enables browser spellcheck inside editor
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML().trim();
      const plain = editor.getText().trim();
      if(formData) {
        formData.content = html;
      }
      setReplyContent?.(plain.length === 0 ? "" : html);
    },
    onFocus: ({ editor }) => {
      if (editor.getText() === "Start your discussion...") {
        editor.commands.clearContent();
      }
    },
  });

  useEffect(() => {
    if (editor) {
      if (formData?.content) {
        editor.commands.setContent(formData.content);
      } else if (!editor.getText()) {
        editor.commands.setContent(
          "<p class='text-gray-400'>Start your discussion...</p>"
        );
      }
    }
  }, [editor, formData]);

  const handleEditorFocus = () => {
    if (editor && editor.getText() === "Start your discussion...") {
      editor.commands.clearContent();
    }
  };
  console.log(editor.getHTML());

  const resetEditor = (e) => {
    e.preventDefault();
    if (editor) {
      editor.commands.clearContent();
      editor.commands.setContent(
        "<p class='text-gray-400'>Start your discussion...</p>"
      );
    }
  };

  const handleEditorButtonClick = (e, action) => {
    e.preventDefault(); // Prevent form submission
    action(); // Call the editor action
  };

  function toolbarButtonClass(active) {
    return `p-2 rounded-md flex items-center justify-center ${
      active
        ? "bg-blue-500 text-white shadow-inner"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    } transition-colors`;
  }

  return (
    <>
      <div className="space-y-2">
        <label htmlFor="content" className="font-medium text-gray-700">
          Content <span className="text-red-500">*</span>
        </label>

        {/* Enhanced Editor Toolbar */}
        <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-t-lg bg-gray-50">
          {/* Formatting Group */}
          <div className="flex gap-1">
            <button
              onClick={(e) =>
                handleEditorButtonClick(e, () =>
                  editor.chain().focus().toggleBold().run()
                )
              }
              title="Bold"
              className={toolbarButtonClass(editor?.isActive("bold"))}
            >
              <Bold size={16} />
            </button>
            <button
              onClick={(e) =>
                handleEditorButtonClick(e, () =>
                  editor.chain().focus().toggleItalic().run()
                )
              }
              title="Italic"
              className={toolbarButtonClass(editor?.isActive("italic"))}
            >
              <Italic size={16} />
            </button>
            <button
              onClick={(e) =>
                handleEditorButtonClick(e, () =>
                  editor.chain().focus().toggleUnderline().run()
                )
              }
              title="Underline"
              className={toolbarButtonClass(editor?.isActive("underline"))}
            >
              <Underline size={16} />
            </button>
            <button
              onClick={(e) =>
                handleEditorButtonClick(e, () =>
                  editor.chain().focus().toggleStrike().run()
                )
              }
              title="Strikethrough"
              className={toolbarButtonClass(editor?.isActive("strike"))}
            >
              <Strikethrough size={16} />
            </button>
          </div>

          {/* Headings Group */}
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                editor?.chain().focus().toggleHeading({ level: 1 }).run();
              }}
              title="Heading 1"
              className={toolbarButtonClass(
                editor?.isActive("heading", { level: 1 })
              )}
            >
              <Heading1 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                editor?.chain().focus().toggleHeading({ level: 2 }).run();
              }}
              title="Heading 2"
              className={toolbarButtonClass(
                editor?.isActive("heading", { level: 2 })
              )}
            >
              <Heading2 size={16} />
            </button>
          </div>

          {/* Lists Group */}
          <div className="flex gap-1">
            <button
              onClick={(e) =>
                handleEditorButtonClick(e, () =>
                  editor.chain().focus().toggleBulletList().run()
                )
              }
              title="Bullet List"
              className={toolbarButtonClass(editor?.isActive("bulletList"))}
            >
              <List size={16} />
            </button>
            <button
              onClick={(e) =>
                handleEditorButtonClick(e, () =>
                  editor.chain().focus().toggleOrderedList().run()
                )
              }
              title="Numbered List"
              className={toolbarButtonClass(editor?.isActive("orderedList"))}
            >
              <ListOrdered size={16} />
            </button>
          </div>

          {/* <div className="flex gap-1">
            {" "}
            <button
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleCodeBlock().run();
              }}
              title="Code Block"
              className={toolbarButtonClass(editor?.isActive("codeBlock"))}
            >
              <Code size={16} />
            </button>
          </div> */}

          {/* Block Group */}
          <div className="flex gap-1">
            <button
              onClick={(e) =>
                handleEditorButtonClick(e, () =>
                  editor.chain().focus().toggleBlockquote().run()
                )
              }
              title="Blockquote"
              className={toolbarButtonClass(editor?.isActive("blockquote"))}
            >
              <Quote size={16} />
            </button>
          </div>

          {/* History Group */}
          <div className="flex gap-1">
            <button
              onClick={(e) =>
                handleEditorButtonClick(e, () =>
                  editor.chain().focus().undo().run()
                )
              }
              title="Undo"
              className={toolbarButtonClass(editor?.can().undo())}
            >
              <Undo2 size={16} />
            </button>
            <button
              onClick={(e) =>
                handleEditorButtonClick(e, () =>
                  editor.chain().focus().redo().run()
                )
              }
              title="Redo"
              className={toolbarButtonClass(editor?.can().redo())}
            >
              <Redo2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                const url = window.prompt("Enter the URL");
                if (url) {
                  editor
                    ?.chain()
                    .focus()
                    .extendMarkRange("link")
                    .setLink({ href: url })
                    .run();
                }
              }}
              title="Add Link"
              className={toolbarButtonClass(editor?.isActive("link"))}
            >
              🔗
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                editor?.chain().focus().unsetLink().run();
              }}
              title="Remove Link"
              className={toolbarButtonClass(editor?.isActive("link"))}
            >
              ❌
            </button>
          </div>

          {/* Reset Button */}
          <div className="flex gap-1 ml-auto">
            <button
              onClick={resetEditor}
              title="Clear content"
              className="p-2 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Editor Content Area with Focus Handling */}
        <div
          className={`border border-t-0 border-gray-300 rounded-b-lg p-4 min-h-[200px] bg-white ${
            editor?.isFocused
              ? "ring-2 ring-blue-300 border-blue-500"
              : "hover:border-gray-400"
          } transition-all`}
          onClick={() => editor?.commands.focus()}
          onFocus={handleEditorFocus}
          tabIndex={-1}
        >
          <EditorContent
            editor={editor}
            className="min-h-[200px] bg-white p-4 space-y-2 
    [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-black 
    [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-black 
    [&_p]:text-base 
    [&_ul]:list-disc [&_ul]:pl-5 
    [&_ol]:list-decimal [&_ol]:pl-5 
    [&_li]:mb-1 
    [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:border-gray-400
    [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800"
          />
        </div>

        {/* {errors.content && (
          <p className="text-sm text-red-600 font-medium flex items-center gap-1">
            <X size={16} /> {errors.content}
          </p>
        )} */}
        <p className="text-xs text-gray-500 mt-2">
          Tip: Use clear paragraphs and be specific to get better responses.
        </p>
      </div>
    </>
  );
};
