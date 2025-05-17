
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/MainLayout';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <MainLayout isAdmin={true}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Administrátorský panel</h1>
          <Button variant="destructive" onClick={handleLogout}>Odhlásit se</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle>Školy a počet hodin</CardTitle>
              <CardDescription>Správa škol a týdenního rozvrhu</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Přidat, upravit nebo odstranit školy a nastavit počet tělovýchovných hodin týdně.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate('/admin/schools')}
              >
                Spravovat školy
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle>Prostředí a vybavení</CardTitle>
              <CardDescription>Správa dostupných prostředí a vybavení</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Přidat, upravit nebo odstranit typy prostředí a vybavení pro tělesnou výchovu.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate('/admin/environments')}
              >
                Spravovat prostředí a vybavení
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle>Hlavní část</CardTitle>
              <CardDescription>Správa cvičebních konstruktů pro hlavní část</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Přidat, upravit nebo odstranit cvičební konstrukty a aktivity pro hlavní část hodiny.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate('/admin/exercises')}
              >
                Spravovat hlavní část
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle>Přípravná a závěrečná část</CardTitle>
              <CardDescription>Správa aktivit pro přípravnou a závěrečnou část</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Přidat, upravit nebo odstranit aktivity pro přípravnou a závěrečnou část hodiny.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate('/admin/preparation-finish')}
              >
                Spravovat přípravnou a závěrečnou část
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle>AI Integrace</CardTitle>
              <CardDescription>Správa AI generátoru pro tvorbu hodin</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Nastavení a správa parametrů pro AI asistenta při tvorbě hodin tělesné výchovy.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate('/admin/ai-settings')}
              >
                Spravovat AI integraci
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
