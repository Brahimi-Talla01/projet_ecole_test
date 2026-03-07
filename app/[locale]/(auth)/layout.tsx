import { Metadata } from 'next';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: 'SuperApp - Plateforme de services',
  description: 'Mise en relation entre clients et prestataires',
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="auth-container min-h-screen bg-gray-100">
      <main>{children}</main>
    </div>
  );
}