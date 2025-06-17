
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, BookOpen, Heart, Settings } from 'lucide-react';
import MainLayout from '@/components/MainLayout';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Zpět na hlavní stránku
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center">O Aplikaci</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700">
                  Tato aplikace vznikla v rámci projektu UNCE
                </p>
                <p className="text-base text-gray-600 mt-2">
                  Autor aplikace: doc. PhDr. Michal Vágner, Ph.D.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Co aplikace umí</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Tvorba jednotlivých hodin</h3>
                      <p className="text-sm text-gray-600">Vytvoření plánu hodiny tělesné výchovy.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Více týdenní plány</h3>
                      <p className="text-sm text-gray-600">Vytvoření více týdenního plánu s možností nastavení počtu hodin v týdnu.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Historie a archivace</h3>
                      <p className="text-sm text-gray-600">Ukládání všech vytvořených hodin a plánů s možností jejich opětovného zobrazení.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <h3 className="font-semibold">Oblíbené cviky</h3>
                      <p className="text-sm text-gray-600">Uložení nebo vytvoření vlastních oblíbených cviků, které je možné přidat do již vytvořené hodiny nabo plánu.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Další funkce:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li>AI asistované generování obsahu hodin na základě vybraných aktivit nebo vybavení</li>
                    <li>Export hodin nebo plánu do formátu Word</li>
                    <li>Databáze oblíbených cviků pro jednotlivé části hodiny</li>
                    <li>V admin módu možnost vytvoření všech položek, ze kterých může uživatel tvořit hodiny</li>
                    <li>V admin módu možnost nastavení systémového promptu, API klíče, výběr modelu AI a optimalizace odpovědí modelu AI</li>
                    <li>V admin módu možnost uložení vlastních souborů, které tvoří znalostní databázi pro model AI</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Návod k použití</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">1. Vytvoření nové hodiny</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ol className="list-decimal pl-5 space-y-2 text-sm">
                      <li>Klikněte na "Vytvořit hodinu" na hlavní stránce</li>
                      <li>Zadejte název, ročník a vyberte školu (v admin můžete ke každé škole přednastavit její vybavení)</li>
                      <li>Vyberte prostředí </li>
                      <li>Vyberte konkrétní aktivity pro přípravnou, hlavní a závěrečnou část</li>
                      <li>Vyberte dostupné vybavení</li>
                      <li>Nastavte dobu přípravné, hlavní a závěrečné části</li>
                      <li>Vyberte roli, kdo povede jednotlivé části hodiny</li>
                      <li>Vygenerujte plán hodiny a poté uložte, upravte nebo použijte model AI</li>
                      <li>Stáhněte si plán hodiny do word</li>
                      <li>Z historie hodin si znovu můžete vygenerovaný plán zobrazit, upravit a stáhnout</li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">2. Vytvoření více týdenního plánu</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ol className="list-decimal pl-5 space-y-2 text-sm">
                      <li>Klikněte na "Vytvořit více týdenní plán"</li>
                      <li>Zadejte základní informace (název, škola, ročník)</li>
                      <li>Vyberte prostředí</li>
                      <li>Vyberte konkrétní aktivity pro přípravnou, hlavní a závěrečnou část</li>
                      <li>Vyberte dostupné vybavení</li>
                      <li>Nastavte dobu přípravné, hlavní a závěrečné části</li>
                      <li>Vyberte roli, kdo povede jednotlivé části hodiny</li>
                      <li>Nastavte počet týdnů a počet hodin v týdnu</li>
                      <li>Zkontrolujte vše, co jte si vybrali a nastavili</li>
                      <li>Nechte AI vygenerovat plán první hodiny a poté i ostatní hodiny</li>
                      <li>Upravte jednotlivé hodiny podle potřeby a uložte nebo stáhněte</li>
                      <li>Z historie hodin si znovu můžete vygenerovaný plán zobrazit a stáhnout</li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">3. Správa oblíbených cviků</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Přidávejte vlastní cviky s popisem a časovými údaji</li>
                      <li>Organizujte cviky podle kategorií</li>
                      <li>Používejte oblíbené cviky při tvorbě nových hodin</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">4. Administrace (pro správce)</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Kompletní správa všech položek</li>
                      <li>Přidávání nových konstruktů a aktivit</li>
                      <li>Nastavení AI pro tvorbu hodiny nebo plánů</li>
                      <li>Vkládání souborů do znalostní databáze</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Tipy pro efektivní používání</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                <li><strong>Využívejte šablony:</strong> Uložené hodiny můžete použít jako základ pro nové</li>
                <li><strong>AI asistent:</strong> Nechte AI vygenerovat obsah podle vašich parametrů a pak jej upravte</li>
                <li><strong>Oblíbené cviky:</strong> Budujte si vlastní databázi osvědčených aktivit</li>
                <li><strong>Export do Wordu:</strong> Vytvořené hodiny můžete snadno vytisknout nebo sdílet</li>
                <li><strong>Více týdenní plány:</strong> Pro dlouhodobé plánování využívejte možnost upravit výběr aktivit před generováním dalších hodin</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
