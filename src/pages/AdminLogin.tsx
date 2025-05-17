
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/components/MainLayout';
import { useToast } from '@/hooks/use-toast';

// V produkční verzi by toto bylo ověřováno proti backendu
const ADMIN_PASSWORD = 'admin123';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulace API volání
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('isAdmin', 'true');
        toast({
          title: "Úspěšné přihlášení",
          description: "Byli jste přihlášeni jako administrátor.",
        });
        navigate('/admin');
      } else {
        toast({
          title: "Chyba přihlášení",
          description: "Nesprávné heslo, zkuste to prosím znovu.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Administrátorské přihlášení</CardTitle>
            <CardDescription className="text-center">
              Zadejte heslo pro přístup do administrátorské sekce
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Heslo</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Zadejte administrátorské heslo"
                    required
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button className="w-full" disabled={isLoading} type="submit">
                  {isLoading ? 'Přihlašování...' : 'Přihlásit se'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => navigate('/')}>
              Zpět na hlavní stránku
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminLogin;
