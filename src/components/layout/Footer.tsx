import Link from "next/link";

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-2 text-sm font-medium text-gray-900 transition-colors hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 rounded-sm"
    >
      <span className="mt-0.5 shrink-0 font-bold text-red-500 transition-transform group-hover:translate-x-0.5" aria-hidden>
        ›
      </span>
      <span>{children}</span>
    </Link>
  );
}

function FooterColumn({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0" id={id}>
      <h3 className="mb-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">{title}</h3>
      <ul className="flex flex-col gap-3.5">{children}</ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="rounded-t-[40px] border-t border-gray-100 bg-white">
      <div className="container mx-auto max-w-6xl px-4 pb-10 pt-14 md:pb-12 md:pt-16 lg:pt-20">
        <Link
          id="site-footer-brand"
          href="/"
          data-button-link
          className="block rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-red-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-label="theWalk Ministries home"
        >
          <span className="block bg-gradient-to-r from-red-900 via-red-soft to-red-500 bg-clip-text text-5xl font-bold leading-[0.92] tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5.5rem]">
            theWalk
          </span>
        </Link>

        <nav
          id="site-footer-nav"
          className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-2 md:mt-16 md:grid-cols-4 md:gap-y-12"
          aria-label="Footer"
        >
          <FooterColumn id="footer-column-explore" title="Explore">
            <li>
              <FooterLink href="/about">About</FooterLink>
            </li>
            <li>
              <FooterLink href="/teachings">Teachings</FooterLink>
            </li>
            <li>
              <FooterLink href="/shop">Shop</FooterLink>
            </li>
            <li>
              <FooterLink href="/donations">
                Give <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">[Impact]</span>
              </FooterLink>
            </li>
          </FooterColumn>

          <FooterColumn id="footer-column-journey" title="Journey">
            <li>
              <FooterLink href="/journey/cross-over">Cross Over</FooterLink>
            </li>
            <li>
              <FooterLink href="/journey/cross-roads">Cross Roads</FooterLink>
            </li>
            <li>
              <FooterLink href="/journey/cross-connect">Cross Connect</FooterLink>
            </li>
            <li>
              <FooterLink href="/journey">Journey overview</FooterLink>
            </li>
          </FooterColumn>

          <FooterColumn id="footer-column-community" title="Community">
            <li>
              <FooterLink href="/get-involved">
                Get involved{" "}
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">[Join us]</span>
              </FooterLink>
            </li>
            <li>
              <FooterLink href="/contact">Contact</FooterLink>
            </li>
            <li>
              <FooterLink href="/register">Register</FooterLink>
            </li>
          </FooterColumn>

          <FooterColumn id="footer-column-account" title="Account">
            <li>
              <FooterLink href="/sign-in">Login</FooterLink>
            </li>
            <li>
              <FooterLink href="/get-involved">Join theWalk</FooterLink>
            </li>
          </FooterColumn>
        </nav>

        <div
          id="site-footer-tagline"
          className="mt-14 flex flex-col gap-8 border-t border-gray-100 pt-10 md:mt-16 md:flex-row md:items-center md:justify-between md:pt-12"
        >
          <div className="flex max-w-xl flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center text-red-500" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
                <path d="M12 2l2.2 6.8H21l-5.5 4 2.1 6.7L12 15.4 6.4 19.5l2.1-6.7L3 8.8h6.8L12 2z" />
              </svg>
            </span>
            <p className="text-sm font-light leading-relaxed text-gray-500 md:text-[15px] md:leading-relaxed">
              A Christ-centered journey of transformation, discipleship, and community. However you are called to
              serve, grow, or connect, there is a place for you here.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2.5 rounded-2xl border border-[rgb(217,217,217)] bg-[rgba(237,233,233,0.4)] px-4 py-3 text-foreground">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-900/10" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="text-foreground" aria-hidden>
                <path
                  d="M2 6l3 3 5-5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-xs font-medium uppercase tracking-wide text-[rgba(55,52,52,0.9)]">Faith · Growth · Purpose</span>
          </div>
        </div>

        <div
          id="site-footer-legal"
          className="mt-10 flex flex-col gap-4 border-t border-gray-100 pt-8 text-[11px] font-medium uppercase tracking-wider text-gray-400 md:mt-12 md:flex-row md:items-center md:justify-between md:pt-10"
        >
          <p className="text-center md:text-left">
            © {year} theWalk Ministries. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:justify-end">
            <Link
              href="/terms"
              className="transition-colors hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 rounded-sm"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="transition-colors hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 rounded-sm"
            >
              Privacy policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
