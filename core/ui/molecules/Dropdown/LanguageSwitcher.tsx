"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/core/i18n/navigation";
import { locales, localeNames, localeFlags } from "@/core/i18n/config";
import { Dropdown } from "./Dropdown";

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();

  const trigger = (
    <div className="flex items-center gap-2 pl-3 py-2">
      <span className="text-base">
        {localeFlags[currentLocale as keyof typeof localeFlags]}
      </span>
      <span className="text-sm font-semibold text-gray-700">
        {localeNames[currentLocale as keyof typeof localeNames]}
      </span>
    </div>
  );

  return (
    <Dropdown trigger={trigger}>
      {locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
            currentLocale === loc
              ? "bg-orange-50 text-[#E86E27] font-bold"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <span className="text-lg">{localeFlags[loc]}</span>
          <span>{localeNames[loc]}</span>
        </Link>
      ))}
    </Dropdown>
  );
}