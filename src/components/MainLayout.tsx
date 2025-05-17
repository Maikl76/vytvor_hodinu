
import React from 'react';
import Header from './Header';
import Footer from './Footer';

type MainLayoutProps = {
  children: React.ReactNode;
  isAdmin?: boolean;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, isAdmin = false }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isAdmin={isAdmin} />
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
