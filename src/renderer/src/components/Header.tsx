function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-7 sm:px-10">
      <span className="font-heading text-lg font-medium uppercase tracking-[0.28em] text-gold-soft/90">
        Savant
      </span>
      <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <a href="#about" className="transition-colors hover:text-gold-soft">
          About
        </a>
        <a href="#feedback" className="transition-colors hover:text-gold-soft">
          Feedback
        </a>
      </nav>
    </header>
  );
}

export default Header;
