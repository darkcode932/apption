import React from "react";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaGithub, FaDribbble } from "react-icons/fa";
import { useT } from "../../i18n/LanguageContext";

const socialLinks = [
  { name: "Facebook", href: "#", icon: FaFacebook },
  { name: "Instagram", href: "#", icon: FaInstagram },
  { name: "Twitter", href: "#", icon: FaTwitter },
  { name: "GitHub", href: "#", icon: FaGithub },
  { name: "Dribbble", href: "#", icon: FaDribbble },
];

export default function Footer() {
  const t = useT();

  return (
    <footer className="bg-[#0b0b0f]/80 backdrop-blur-md border-t border-white/5 mt-auto">
      <div className="mx-auto max-w-7xl flex flex-col space-y-6 items-center overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
        <Link href="/home" className="flex-shrink-0">
          <span className="font-extrabold text-xl bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent tracking-widest">
            APPTION
          </span>
        </Link>
        <p className="text-center text-neutral-450 text-sm font-light tracking-wide max-w-sm leading-relaxed">
          {t("footer.tagline")}
        </p>
        <div className="flex justify-center space-x-5">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-neutral-500 hover:text-green-400 transition-all duration-200 hover:scale-110"
              aria-label={item.name}
            >
              <item.icon className="h-5 w-5" />
            </a>
          ))}
        </div>
        <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <p className="text-center text-[11px] text-neutral-600">
          &copy; {new Date().getFullYear()} APPTION. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}

