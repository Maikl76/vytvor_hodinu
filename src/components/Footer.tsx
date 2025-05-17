
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-4 px-6 mt-auto">
      <div className="container mx-auto text-center text-gray-600">
        <p>© {currentYear} TV Hodiny Generator AI - Aplikace pro učitele a trenéry tělesné výchovy</p>
      </div>
    </footer>
  );
};

export default Footer;
