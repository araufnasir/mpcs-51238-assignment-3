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
      <ul className="flex gap-1 sm:gap-6">
        {links.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`${type.label} group flex min-h-11 min-w-11 items-center justify-center ${focusRing}`}
              >
                <span
                  className={`border-b-2 py-1 ${
                    active ? "border-ln-text" : "border-transparent group-hover:border-ln-muted"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
