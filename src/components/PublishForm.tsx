"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { publishFromForm } from "@/app/actions";
import { type DocFormat, formatLabel } from "@/lib/formats";

type Tab = "upload" | "paste";

const MAX_FILE_BYTES = 2 * 1024 * 1024;

function detectFormat(name: string): DocFormat | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".md") || lower.endsWith(".markdown")) return "md";
  if (lower.endsWith(".html") || lower.endsWith(".htm")) return "html";
  if (lower.endsWith(".pdf")) return "pdf";
  return null;
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function describeSize(format: DocFormat, contentLength: number): string {
  // PDF content is base64-encoded; binary is ~3/4 the encoded length.
  const bytes = format === "pdf" ? contentLength * 0.75 : contentLength;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function PublishForm({ initialError }: { initialError?: string }) {
  const [tab, setTab] = useState<Tab>("upload");
  const [content, setContent] = useState("");
  const [format, setFormat] = useState<DocFormat>("md");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.size > MAX_FILE_BYTES) {
      setClientError(
        `File too large (max 2 MB, got ${(file.size / 1024 / 1024).toFixed(1)} MB).`
      );
      return;
    }
    try {
      const detected = detectFormat(file.name);
      if (detected === "pdf") {
        const base64 = await readFileAsBase64(file);
        setContent(base64);
      } else {
        const text = await file.text();
        setContent(text);
      }
      setFileName(file.name);
      if (detected) setFormat(detected);
      setClientError(null);
    } catch (err) {
      setClientError(
        `Couldn't read file: ${err instanceof Error ? err.message : "unknown error"}`
      );
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void handleFile(file);
  }

  function onFileInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  }

  const dropzoneClass = dragging
    ? "dropzone dragging"
    : fileName
      ? "dropzone has-file"
      : "dropzone";

  return (
    <form action={publishFromForm} className="publish-form">
      <div className="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "upload"}
          className={tab === "upload" ? "tab active" : "tab"}
          onClick={() => setTab("upload")}
        >
          Upload
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "paste"}
          className={tab === "paste" ? "tab active" : "tab"}
          onClick={() => setTab("paste")}
        >
          Paste
        </button>
      </div>

      {tab === "upload" ? (
        <div
          className={dropzoneClass}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,.html,.htm,.pdf,.txt"
            onChange={onFileInput}
            style={{ display: "none" }}
          />
          {fileName ? (
            <>
              <div className="dropzone-icon">✓</div>
              <div className="dropzone-title">{fileName}</div>
              <div className="dropzone-subtitle">
                {describeSize(format, content.length)} · detected:{" "}
                {formatLabel(format)} · click to change
              </div>
            </>
          ) : (
            <>
              <div className="dropzone-icon">⤓</div>
              <div className="dropzone-title">Drop your file here</div>
              <div className="dropzone-subtitle">
                .md, .markdown, .html, .pdf — or click to browse
              </div>
            </>
          )}
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your HTML or Markdown here..."
          spellCheck={false}
        />
      )}

      {/* Hidden inputs carry the submitted values */}
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="format" value={format} />

      {/* Format toggle only shown in Paste mode (PDFs can't be pasted) */}
      {tab === "paste" && (
        <div className="format-row">
          <span className="field-label">Format</span>
          <div className="format-toggle">
            <button
              type="button"
              className={format === "md" ? "format-option active" : "format-option"}
              onClick={() => setFormat("md")}
            >
              Markdown
            </button>
            <button
              type="button"
              className={format === "html" ? "format-option active" : "format-option"}
              onClick={() => setFormat("html")}
            >
              HTML
            </button>
          </div>
        </div>
      )}

      <div className="field-row">
        <div className="field">
          <label className="field-label" htmlFor="title">
            Title
          </label>
          <input type="text" id="title" name="title" placeholder="Optional" />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Optional"
            autoComplete="new-password"
          />
        </div>
      </div>

      <div className="checkbox-row">
        <input type="checkbox" id="indexable" name="indexable" />
        <label htmlFor="indexable">
          Allow search engines to index this page
          <span className="checkbox-hint">— off by default, so docs stay share-by-link</span>
        </label>
      </div>

      <div className="actions">
        <button type="submit" className="btn-primary" disabled={!content.trim()}>
          Publish →
        </button>
      </div>

      {clientError && <p className="error-msg">{clientError}</p>}
      {initialError === "empty" && (
        <p className="error-msg">Add a file or paste some content.</p>
      )}
      {initialError === "format" && <p className="error-msg">Pick Markdown, HTML, or PDF.</p>}
    </form>
  );
}
