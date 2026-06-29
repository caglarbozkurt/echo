import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner mono">
        <Link href="/" className="site-footer-brand">
          echo<span className="site-footer-cursor">_</span>
        </Link>
        <span className="site-footer-sep">·</span>
        <span className="site-footer-meta">
          Built by{" "}
          <a
            href="https://github.com/caglarbozkurt"
            target="_blank"
            rel="noopener noreferrer"
          >
            caglar
          </a>{" "}
          with{" "}
          <span className="site-footer-heart" aria-label="love">
            ♥
          </span>
        </span>
        <span className="site-footer-sep">·</span>
        <a
          href="https://github.com/caglarbozkurt/echo"
          target="_blank"
          rel="noopener noreferrer"
          className="site-footer-link"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
