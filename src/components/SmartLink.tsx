"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { SITE_HOST } from "@/config/build";
import { useLinkLabels } from "./LinkLabels";

type Kind = "internal" | "external" | "contact" | "file";

/**
 * Edino mesto, kjer se izriše <a> (pravila gradnje, sekcija 4.6):
 * - zunanja (http(s) na drugo domeno): nov zavihek, rel="noopener", za bralnike zaslona "(opens in a new tab)"
 * - notranja (/…, #…, ista domena): isti zavihek prek next/link
 * - tel:, mailto:: isti zavihek, brez target
 * - datoteka na strani (/uploads/…): nov zavihek
 * target se nikoli ne nastavlja iz vsebine.
 */
export function linkKind(href: string): Kind {
  if (/^(mailto|tel):/i.test(href)) return "contact";
  if (href.startsWith("/uploads/")) return "file";
  if (/^https?:\/\//i.test(href)) {
    try {
      const host = new URL(href).hostname.replace(/^www\./, "");
      return host === SITE_HOST ? "internal" : "external";
    } catch {
      return "external";
    }
  }
  return "internal";
}

type Props = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "target" | "rel"
> & {
  href: string;
  children: ReactNode;
};

export default function SmartLink({ href, children, ...rest }: Props) {
  const { newTab } = useLinkLabels();
  const kind = linkKind(href);

  if (kind === "internal") {
    // ista domena z absolutnim URL-jem → relativna pot
    const local = /^https?:\/\//i.test(href)
      ? new URL(href).pathname + new URL(href).search + new URL(href).hash
      : href;
    return (
      <Link href={local} {...rest}>
        {children}
      </Link>
    );
  }

  if (kind === "contact") {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  // zunanja povezava ali datoteka: nov zavihek
  const label = rest["aria-label"];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      {...rest}
      aria-label={label && newTab ? `${label} ${newTab}` : label}
    >
      {children}
      {!label && newTab && <span className="sr-only"> {newTab}</span>}
    </a>
  );
}
