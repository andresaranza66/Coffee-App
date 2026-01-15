import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-amber-900/30 bg-brown-primary">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href={"/"}
          className="text-2xl font-bold tracking-wide text-amber-400"
        >
          Coffee
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            href={"/"}
            className="text-sm font-medium text-amber-100 hover:text-amber-400"
          >
            My account
          </Link>
          <Link
            href={"/"}
            className="text-sm font-medium text-amber-100 hover:text-amber-400"
          >
            Get Your coffee
          </Link>
        </nav>
      </div>
    </header>
  );
}
