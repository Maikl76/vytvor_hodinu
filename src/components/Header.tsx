
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type HeaderProps = {
  isAdmin?: boolean;
  className?: string;
};

const Header: React.FC<HeaderProps> = ({ isAdmin = false, className }) => {
  const navigate = useNavigate();

  return (
    <header className={cn("bg-primary py-4 px-6 flex items-center justify-between", className)}>
      <div className="flex items-center gap-2">
        <h1 
          className="text-2xl font-bold text-white cursor-pointer" 
          onClick={() => navigate('/')}
        >
          TV Hodiny Generator
        </h1>
      </div>
      <div className="flex gap-4">
        {isAdmin ? (
          <>
            <Button 
              variant="outline" 
              className="text-primary bg-white hover:bg-gray-100"
              onClick={() => navigate('/')}
            >
              Zpět na uživatelskou část
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="outline" 
              className="text-primary bg-white hover:bg-gray-100"
              onClick={() => navigate('/admin/login')}
            >
              Admin přihlášení
            </Button>
            <Button 
              variant="outline" 
              className="text-primary bg-white hover:bg-gray-100"
              onClick={() => navigate('/history')}
            >
              Historie hodin
            </Button>
            <Button 
              variant="outline" 
              className="text-primary bg-white hover:bg-gray-100"
              onClick={() => navigate('/weekly-plans-history')}
            >
              Historie plánů
            </Button>
            <Button 
              variant="outline" 
              className="text-primary bg-white hover:bg-gray-100"
              onClick={() => navigate('/favorite-exercises')}
            >
              Oblíbené cviky
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
