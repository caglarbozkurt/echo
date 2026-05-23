"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { publishFromForm } from "@/app/actions";

type Tab = "upload" | "paste";
type Format = "md" | "html";

const MAX_FILE = 2 * 1024 * 1024;

function detectFormat(name: string): Format | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".md") || lower.endsWith(".markdown")) return "md";
  if (lower.endsWith(".html") || lower.endsWith(".htm")) return "html";
  return null;
}

export function PublishForm({ initialError }: { initialError?: string }) {
  const [tab, setTab] = useState<Tab>("upload");
  const [content, setContent] = useState("");
  const [format, setFormat] = useState<Format>("md");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.size > MAX_FILE) {
      setClientError(`File too large (max 2 MB, got ${(file.size / 1024 / 1024).toFixed(1)} MB).`);
      return;
    }
    const text = await file.text();
    setContent(text);
    setFileName(file.name);
    const detected = detectFormat(file.name);
    if (detected) setFormat(detected);
    setClientError(null);
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
          className={
            dragging
              ? "dropzone dragging"
              : fileName
                ? "dropzone has-file"
                : "dropzone"
          }
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
            accept=".md,.markdown,.html,.htm,.txt"
            onChange={onFileInput}
            style={{ display: "none" }}
          />
          {fileName ? (
            <>
              <div className="dropzone-icon">✓</div>
              <div className="dropzone-title">{fileName}</div>
              <div className="dropzone-subtitle">
                {(content.length / 1024).toFixed(1)} KB · detected:{" "}
                {format === "md" ? "Markdown" : "HTML"} · click to change
              </div>
            </>
          ) : (
            <>
              <div className="dropzone-icon">⤓</div>
              <div className="dropzone-title">Drop your file here</div>
              <div className="dropzone-subtitle">
                .md, .markdown, .html — or click to browse
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

      {/* Format toggle only shown in Paste mode; in Upload mode it's auto-detected */}
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

      <div className="actions">
        <button type="submit" className="btn-primary" disabled={!content.trim()}>
          Publish →
        </button>
      </div>

      {clientError && <p className="error-msg">{clientError}</p>}
      {initialError === "empty" && (
        <p className="error-msg">Add a file or paste some content.</p>
      )}
      {initialError === "format" && <p className="error-msg">Pick Markdown or HTML.</p>}
    </form>
  );
}
