'use client';

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function SignOutButton({ locale }: { locale: string }) {
  const t = useTranslations('Dashboard');
  
  const handleSignOut = () => {
    signOut({ callbackUrl: `/${locale}` });
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
    >
      {t('logout')}
    </button>
  );
}
