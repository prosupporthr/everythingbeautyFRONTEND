"use client";

import React, { useEffect, useRef, useState } from "react";
import { useField } from "formik";
import Editor, {
  BtnBold,
  BtnItalic,
  Toolbar,
  BtnUnderline,
  BtnNumberedList,
  BtnBulletList,
  createButton,
} from "react-simple-wysiwyg";
import {
  RiAlignCenter,
  RiAlignLeft,
  RiAlignRight,
  RiAlignJustify,
  RiVideoOffFill,
  RiCameraOffFill,
  RiVideoOnFill,
  RiCameraFill,
  RiLinkM,
  RiLinkUnlinkM,
} from "react-icons/ri";

// --- Utilities ---
function ensureUrl(url: string) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}
function escapeAttr(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// --- Convert YouTube URLs to embed URLs ---
function getYouTubeEmbedUrl(url: string): string {
  try {
    const ytUrl = new URL(url);

    if (ytUrl.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${ytUrl.pathname.slice(1)}`;
    }

    if (ytUrl.searchParams.has("v")) {
      return `https://www.youtube.com/embed/${ytUrl.searchParams.get("v")}`;
    }

    if (ytUrl.pathname.includes("/shorts/")) {
      const id = ytUrl.pathname.split("/shorts/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }

    if (ytUrl.pathname.includes("/embed/")) {
      return url;
    }

    return url;
  } catch {
    return url;
  }
}

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  height?: string | number;
}

const FormikSimpleWYSIWYG: React.FC<Props> = ({
  name,
  label,
  placeholder = "Type something...",
  height = "200px",
}) => {
  const [field, meta, helpers] = useField(name);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const [hasImage, setHasImage] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasLink, setHasLink] = useState(false);

  // --- Modals ---
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  // --- Selection helpers ---
  const captureSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (!sel || !savedRangeRef.current) return;
    sel.removeAllRanges();
    sel.addRange(savedRangeRef.current);

    if (editorRef.current) editorRef.current.focus();
  };

  // --- Insert functions ---
  const insertImage = (rawUrl: string) => {
    const url = ensureUrl(rawUrl.trim());
    if (!url) return;
    restoreSelection();

    const html = `<img 
      src="${escapeAttr(url)}" 
      alt="" 
      contenteditable="false"
      style="max-width:100%;height:auto;display:block;margin:0.5rem 0;" 
    />`;
    document.execCommand("insertHTML", false, html);

    setShowImageModal(false);
    setImageUrl("");
  };

  const insertVideo = (rawUrl: string) => {

    const embedUrl = getYouTubeEmbedUrl(ensureUrl(rawUrl.trim()));

    if (!embedUrl) return;
    restoreSelection();

    const cleanEmbedUrl = `${embedUrl}?modestbranding=1&rel=0&showinfo=0&controls=1&disablekb=1&iv_load_policy=3&fs=1`;

    const html = `
      <span data-editable-video style="display:block;position:relative;">
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
          <iframe
          src="${escapeAttr(cleanEmbedUrl)}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowfullscreen
          style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
        ></iframe>
        </div>
      </span>`;
    document.execCommand("insertHTML", false, html);

    setShowVideoModal(false);
    setVideoUrl("");
  };

  const insertLink = (rawUrl: string, text: string) => {
    const url = ensureUrl(rawUrl.trim());
    if (!url) return;
    restoreSelection();

    const safeText = text.trim() || url;
    const html = `<a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">${escapeAttr(
      safeText
    )}</a>`;

    document.execCommand("insertHTML", false, html);

    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
  };

  // --- Remove functions ---
  const removeClosest = (selector: string) => {
    const sel = window.getSelection();
    if (sel?.anchorNode) {
      const node = (sel.anchorNode as HTMLElement).parentElement;
      const target = node?.closest(selector);
      if (target) target.remove();
    }
  };

  // --- Toolbar buttons ---
  const BtnAlignCenter = createButton(
    "Align center",
    <RiAlignCenter />,
    "justifyCenter"
  );
  const BtnAlignLeft = createButton("Align left", <RiAlignLeft />, "justifyLeft");
  const BtnAlignRight = createButton(
    "Align right",
    <RiAlignRight />,
    "justifyRight"
  );
  const BtnAlignJustify = createButton(
    "Justify",
    <RiAlignJustify />,
    "justifyFull"
  );

  const BtnImage = createButton("Insert image", <RiCameraFill />, () => {
    captureSelection();
    setShowImageModal(true);
  });
  const BtnVideo = createButton("Insert video", <RiVideoOnFill />, () => {
    captureSelection();
    setShowVideoModal(true);
  });
  const BtnLink = createButton("Insert link", <RiLinkM />, () => {
    captureSelection();
    setShowLinkModal(true);
  });

  const BtnRemoveImage = createButton("Remove image", <RiCameraOffFill />, () =>
    removeClosest("img")
  );
  const BtnRemoveVideo = createButton("Remove video", <RiVideoOffFill />, () =>
    removeClosest("[data-editable-video]")
  );
  const BtnRemoveLink = createButton("Remove link", <RiLinkUnlinkM />, () =>
    removeClosest("a")
  );

  // --- Watch editor content ---
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (editorRef.current) {
        setHasImage(editorRef.current.querySelector("img") !== null);
        setHasVideo(
          editorRef.current.querySelector("[data-editable-video]") !== null
        );
        setHasLink(editorRef.current.querySelector("a") !== null);
      }
    });

    if (editorRef.current) {
      observer.observe(editorRef.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-2">
      {label && <label className="font-medium">{label}</label>}

      <Editor
        ref={editorRef}
        value={field.value || ""}
        onChange={(e) =>
          helpers.setValue((e.target as HTMLTextAreaElement).value)
        }
        placeholder={placeholder}
        style={{ minHeight: height }}
      >
        <Toolbar>
          <BtnBold />
          <BtnItalic />
          <BtnUnderline />
          <BtnNumberedList />
          <BtnBulletList />
          <BtnAlignLeft />
          <BtnAlignCenter />
          <BtnAlignRight />
          <BtnAlignJustify />
          <BtnImage />
          <BtnVideo />
          <BtnLink />
          {hasImage && <BtnRemoveImage />}
          {hasVideo && <BtnRemoveVideo />}
          {hasLink && <BtnRemoveLink />}
        </Toolbar>
      </Editor>

      {meta.touched && meta.error && (
        <p className="text-red-500 text-sm">{meta.error}</p>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded bg-white p-4 shadow">
            <h3 className="mb-2 font-medium">Insert image (URL)</h3>
            <input
              autoFocus
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="mb-3 w-full rounded border px-3 py-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImageModal(false)}
                className="rounded border px-3 py-1"
              >
                Cancel
              </button>
              <button
                onClick={() => insertImage(imageUrl)}
                className="rounded bg-blue-600 px-3 py-1 text-white"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[350px] rounded bg-white p-4 shadow">
            <h3 className="mb-2 font-medium">Insert video (YouTube link)</h3>
            <input
              autoFocus
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste any YouTube link (watch, shorts, youtu.be)"
              className="mb-3 w-full rounded border px-3 py-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowVideoModal(false)}
                className="rounded border px-3 py-1"
              >
                Cancel
              </button>
              <button
                onClick={() => insertVideo(videoUrl)}
                className="rounded bg-blue-600 px-3 py-1 text-white"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[350px] rounded bg-white p-4 shadow">
            <h3 className="mb-2 font-medium">Insert hyperlink</h3>
            <input
              autoFocus
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="mb-2 w-full rounded border px-3 py-2"
            />
            <input
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Display text (optional)"
              className="mb-3 w-full rounded border px-3 py-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLinkModal(false)}
                className="rounded border px-3 py-1"
              >
                Cancel
              </button>
              <button
                onClick={() => insertLink(linkUrl, linkText)}
                className="rounded bg-blue-600 px-3 py-1 text-white"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormikSimpleWYSIWYG;
