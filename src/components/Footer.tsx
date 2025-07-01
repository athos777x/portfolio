import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 px-6 md:px-12 border-t border-foreground/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="text-lg font-medium tracking-tighter mb-2">
            athos.
          </Link>
          <p className="text-sm text-foreground/60">
            © {currentYear} All rights reserved.
          </p>
        </div>
        
        <nav className="flex gap-6 text-sm text-foreground/60">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link href="/sitemap" className="hover:text-foreground transition-colors">
            Sitemap
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer; 