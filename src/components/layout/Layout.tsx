import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { FixedDiscordButton, DiscordCommunitySection } from '@/components/DiscordButton';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FixedDiscordButton />
      <main className="pt-16 pb-20 md:pt-20 md:pb-8">
        <div className="container mx-auto px-4">
          {children}
          <DiscordCommunitySection />
        </div>
      </main>
    </div>
  );
};
