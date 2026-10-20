"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { focusRing, type } from "./type";

const links = [
  { href: "/", label: "Today" },
  { href: "/log", label: "Log" },
  { href: "/history", label: "History" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main">
      <ul className="flex gap-6">
        {links.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`${type.label} border-b-2 py-1 ${focusRing} ${
                  active ? "border-ln-text" : "border-transparent hover:border-ln-muted"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
