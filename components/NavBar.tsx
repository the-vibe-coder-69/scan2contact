"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/camera", label: "Camera" },
  { href: "/upload", label: "Upload" }
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white/80 dark:bg-neutral-900/80 shadow px-4 py-3 mb-8">
      <div className="max-w-4xl mx-auto flex items-center gap-6">
        <span className="font-bold text-xl text-blue-700 dark:text-blue-300 tracking-tight">Contact Snapshot</span>
        <div className="flex gap-4 ml-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1 rounded hover:bg-blue-100 dark:hover:bg-neutral-800 transition 
                ${pathname === link.href
                  ? "bg-blue-600 text-white dark:bg-blue-500"
                  : "text-gray-800 dark:text-gray-100"}
              `}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}