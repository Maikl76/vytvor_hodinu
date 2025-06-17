
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, BookOpen, Settings, Heart, Info } from 'lucide-react';
import MainLayout from '@/components/MainLayout';

const Index = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Plánování hodin tělesné výchovy
          </h1>
          <p className="text-xl text-gray-600">
            Nástroj pro vytváření a správu jednotlivých hodin i více týdenních plánů
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/create-lesson')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Vytvořit hodinu
              </CardTitle>
              <CardDescription>
                Vytvoř novou hodinu tělesné výchovy podle svých potřeb
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Začít</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/create-weekly-plan')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Vytvořit více týdenní plán
              </CardTitle>
              <CardDescription>
                Naplánuj hodiny pro celý semestr nebo školní rok
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Začít</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/history')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Historie hodin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Zobrazit</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/weekly-plans-history')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Historie plánů
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Zobrazit</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/favorite-exercises')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Heart className="mr-2 h-4 w-4 text-red-500" />
                Oblíbené cviky
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Spravovat</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Settings className="mr-2 h-5 w-5" />
                Administrace
              </CardTitle>
              <CardDescription>
                Správa škol, prostředí, cvičebních konstruktů a AI nastavení
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/admin')}
                className="w-full"
              >
                Přejít do administrace
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Info className="mr-2 h-5 w-5" />
                O Aplikaci
              </CardTitle>
              <CardDescription>
                Informace o aplikaci, autorovi a návod k použití
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/about')}
                className="w-full"
              >
                Zobrazit
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
