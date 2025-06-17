
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-4">TV Hodiny Generator AI</h1>
          <p className="text-xl text-gray-600">
            Vytvořte snadno a rychle profesionální přípravu na hodinu tělesné výchovy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader>
              <CardTitle>Vytvořit novou hodinu</CardTitle>
              <CardDescription>
                Postupně sestavte plán hodiny tělesné výchovy pro žáky
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Průvodce vás provede celým procesem tvorby hodiny od výběru školy a prostředí až po generování finálního dokumentu.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate('/create-lesson')}
              >
                Začít s tvorbou hodiny
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader>
              <CardTitle>Historie hodin</CardTitle>
              <CardDescription>
                Přístup k vašim dříve vytvořeným hodinám
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Zobrazte, upravte nebo stáhněte vaše dříve vytvořené hodiny tělesné výchovy.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/history')}
              >
                Zobrazit historii
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader>
              <CardTitle>Vytvořit více týdenní plán</CardTitle>
              <CardDescription>
                Postupně sestavte plán na více týdnů tělesné výchovy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Průvodce vás provede procesem tvorby více týdenního plánu s možností výběru školy, prostředí a dalších parametrů.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => navigate('/create-weekly-plan')}
              >
                Začít s tvorbou plánu
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader>
              <CardTitle>Historie plánů</CardTitle>
              <CardDescription>
                Přístup k vašim dříve vytvořeným více týdenním plánům
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Zobrazte, upravte nebo stáhněte vaše dříve vytvořené více týdenní plány tělesné výchovy.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/weekly-plans-history')}
              >
                Zobrazit historii plánů
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg mb-10">
          <CardHeader>
            <CardTitle>O aplikaci</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              TV Hodiny Generator AI je aplikace navržená pro učitele a trenéry tělesné výchovy. Pomáhá s rychlou a efektivní tvorbou profesionálních příprav na hodiny tělesné výchovy pro žáky základních škol.
            </p>
            <p>
              Aplikace umožňuje:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Postupné sestavení hodiny podle vašich potřeb</li>
              <li>Výběr z databáze cviků vhodných pro různé věkové kategorie</li>
              <li>Generování strukturované písemné přípravy</li>
              <li>Export do formátu Word</li>
              <li>Ukládání vytvořených hodin do historie</li>
              <li>Tvorbu více týdenních plánů tělesné výchovy</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Home;
