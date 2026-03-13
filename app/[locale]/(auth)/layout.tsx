import { APP_CONFIG } from '@/core/config/constants';
import { Metadata } from 'next';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: APP_CONFIG.NAME,
  description: APP_CONFIG.DESCRIPTION,
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen">
      <main>{children}</main>
    </div>
  );
}