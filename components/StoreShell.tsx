'use client';

import { usePathname } from 'next/navigation';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import CartSidebar from './CartSidebar';
import WhatsAppButton from './WhatsAppButton';
import Footer from './Footer';
import MiniFAQ from './MiniFAQ';
import NewsletterSection from './NewsletterSection';

interface Props {
  children: React.ReactNode;
  announcement?: { text: string; enabled: boolean };
  navCategories?: { id: string; name: string; slug: string }[];
}

export default function StoreShell({ children, announcement, navCategories = [] }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <AnnouncementBar text={announcement?.text} enabled={announcement?.enabled} />
      <Header navCategories={navCategories} />
      <CartSidebar />
      {children}
      <MiniFAQ />
      <NewsletterSection />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
