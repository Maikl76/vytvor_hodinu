
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/MainLayout';
import { useToast } from '@/hooks/use-toast';
import { getLessons, deleteLesson } from '@/services/supabaseService';

const History: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    setIsLoading(true);
    const lessonsData = await getLessons();
    setLessons(lessonsData);
    setIsLoading(false);
  };

  const handleView = (lesson: any) => {
    // Přejít na náhled hodiny s ID v parametru trasy
    navigate(`/preview-lesson/${lesson.id}`);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteLesson(id);
    
    if (success) {
      setLessons(lessons.filter(lesson => lesson.id !== id));
      toast({
        title: "Hodina smazána",
        description: `Hodina byla smazána z historie.`,
      });
    }
  };

  const filteredLessons = searchTerm
    ? lessons.filter(lesson => 
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lesson.school?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.environment?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : lessons;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">Historie hodin</h1>
          <p className="text-gray-600 mt-2">
            Seznam vašich vytvořených hodin tělesné výchovy
          </p>
        </div>
        
        <div className="mb-6 flex justify-between items-center">
          <Button onClick={() => navigate('/create-lesson')}>
            Vytvořit novou hodinu
          </Button>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Hledat v historii..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p>Načítání hodin...</p>
          </div>
        ) : filteredLessons.length > 0 ? (
          <div className="space-y-4 mb-8">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle>{lesson.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Škola</p>
                      <p>{lesson.school?.name || 'Neznámá'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Datum</p>
                      <p>{new Date(lesson.created_at).toLocaleDateString('cs-CZ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prostředí</p>
                      <p>{lesson.environment?.name || 'Nespecifikováno'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Délka</p>
                      <p>{lesson.preparation_time + lesson.main_time + lesson.finish_time} minut</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleView(lesson)}>
                      Zobrazit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(lesson.id)}>
                      Smazat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center p-8 mb-8">
            <p className="text-gray-500 mb-4">Zatím nemáte uložené žádné hodiny</p>
            <Button onClick={() => navigate('/create-lesson')}>
              Vytvořit první hodinu
            </Button>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default History;
