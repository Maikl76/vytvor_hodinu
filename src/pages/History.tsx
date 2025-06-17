import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MainLayout from '@/components/MainLayout';
import { useToast } from '@/hooks/use-toast';
import { getLessons, deleteLesson } from '@/services/supabaseService';
import { exportWeeklyPlanToDocument } from '@/services/weekly-plan';
import { generateAndDownloadLessonPlan } from '@/utils/documentUtils';
import { supabase } from '@/integrations/supabase/client';
import { Filter, School, FileText, Zap, Download, Eye, Trash2 } from 'lucide-react';

const History: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lessons, setLessons] = useState<any[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<any[]>([]);
  const [schools, setSchools] = useState<{id: number, name: string}[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [sortType, setSortType] = useState<string>('date');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name')
        .order('name');
        
      if (error) throw error;
      setSchools(data || []);
    } catch (error) {
      console.error('Error loading schools:', error);
    }
  };

  useEffect(() => {
    loadSchools();
  }, []);

  useEffect(() => {
    loadLessons();
  }, []);

  useEffect(() => {
    let filtered = [...lessons];
    
    if (selectedSchool !== 'all') {
      const schoolId = parseInt(selectedSchool);
      filtered = filtered.filter(lesson => lesson.school_id === schoolId);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(lesson => 
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (lesson.school?.name && lesson.school.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lesson.environment?.name && lesson.environment.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Sort by selected criteria
    switch (sortType) {
      case 'name':
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'date':
        filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'grade':
        filtered = filtered.sort((a, b) => a.grade - b.grade);
        break;
    }
    
    setFilteredLessons(filtered);
  }, [selectedSchool, sortType, searchTerm, lessons]);

  const loadLessons = async () => {
    setIsLoading(true);
    const lessonsData = await getLessons();
    setLessons(lessonsData);
    setFilteredLessons(lessonsData);
    setIsLoading(false);
  };

  const handleView = (lesson: any) => {
    navigate(`/preview-lesson/${lesson.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Opravdu chcete smazat tuto hodinu?')) return;
    
    const success = await deleteLesson(id);
    
    if (success) {
      setLessons(lessons.filter(lesson => lesson.id !== id));
      toast({
        title: "Hodina smazána",
        description: `Hodina byla smazána z historie.`,
      });
    }
  };

  const handleDownloadLesson = async (lesson: any) => {
    if (!lesson.id) return;

    try {
      toast({
        title: "Stahování zahájeno",
        description: "Dokument se připravuje ke stážení.",
      });

      // Check if this is a generated lesson or a template
      const isGenerated = lesson.title.includes('(Vygenerováno)') || (lesson.prompt_data && lesson.prompt_data !== null);
      
      console.log("Downloading lesson:", { lesson, isGenerated });

      // Prepare lesson data for download
      const lessonData = {
        title: lesson.title.replace(' (Vygenerováno)', ''), // Remove the suffix for document
        school: lesson.school?.name || 'Neurčeno',
        environment: lesson.environment?.name || 'Neurčeno',
        construct: lesson.constructs?.name || 'Neurčeno',
        preparationTime: lesson.preparation_time || 10,
        mainTime: lesson.main_time || 25,
        finishTime: lesson.finish_time || 10,
        preparationRole: lesson.preparation_roles?.name || 'Neurčeno',
        mainRole: lesson.main_roles?.name || 'Neurčeno',
        finishRole: lesson.finish_roles?.name || 'Neurčeno'
      };

      // Get equipment names
      const equipmentNames = lesson.lesson_equipment?.map((eq: any) => eq.equipment?.name).filter(Boolean) || [];
      
      // Get exercise data from lesson_data
      let exerciseData = null;
      if (lesson.lesson_data && typeof lesson.lesson_data === 'object' && lesson.lesson_data !== null) {
        const lessonDataObj = lesson.lesson_data as any;
        exerciseData = lessonDataObj.exercises || lessonDataObj.exerciseData || null;
      }

      console.log("Download data prepared:", { lessonData, exerciseData, equipmentNames });

      if (!exerciseData) {
        throw new Error("Nebyla nalezena data cvičení pro stažení");
      }

      const success = await generateAndDownloadLessonPlan(lessonData, equipmentNames, exerciseData);
      
      if (success) {
        toast({
          title: "Stažení dokončeno",
          description: "Hodina byla úspěšně stažena jako Word dokument.",
        });
      } else {
        throw new Error("Chyba při generování dokumentu");
      }
    } catch (error) {
      console.error("Error downloading lesson:", error);
      toast({
        title: "Chyba při stahování",
        description: "Nepodařilo se stáhnout hodinu.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('cs-CZ', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Historie hodin</h1>
          <Button onClick={() => navigate('/create-lesson')}>
            Vytvořit novou hodinu
          </Button>
        </div>
        
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span>Filtrovat podle školy:</span>
            </div>
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger>
                <SelectValue placeholder="Všechny školy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všechny školy</SelectItem>
                {schools.map(school => (
                  <SelectItem key={school.id} value={school.id.toString()}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span>Řadit podle:</span>
            </div>
            <Select value={sortType} onValueChange={setSortType}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte řazení" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Název (A-Z)</SelectItem>
                <SelectItem value="date">Datum uložení (nejnovější)</SelectItem>
                <SelectItem value="grade">Ročník (1-9)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span>Hledat:</span>
            </div>
            <input 
              type="text" 
              placeholder="Hledat v historii..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p>Načítání hodin...</p>
          </div>
        ) : filteredLessons.length > 0 ? (
          <div className="space-y-4 mb-8">
            {filteredLessons.map((lesson) => {
              // Improved logic for determining if lesson is generated
              const isGenerated = lesson.title.includes('(Vygenerováno)') || (lesson.prompt_data && lesson.prompt_data !== null);
              return (
                <Card key={lesson.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex-1">
                        {isGenerated 
                          ? lesson.title.replace(' (Vygenerováno)', '')
                          : lesson.title
                        }
                      </CardTitle>
                      <div className="flex flex-col gap-1 ml-4">
                        {isGenerated ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                            <Zap className="h-3 w-3 mr-1" />
                            Vygenerováno
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            Podklad
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 flex items-center">
                          <School className="h-4 w-4 mr-1" />
                          Škola
                        </p>
                        <p>{lesson.school?.name || 'Neznámá'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Datum</p>
                        <p>{formatDate(lesson.created_at)}</p>
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
                        <Eye className="h-4 w-4 mr-1" />
                        {isGenerated ? 'Zobrazit hodinu' : 'Zobrazit podklad'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadLesson(lesson)}>
                        <Download className="h-4 w-4 mr-1" />
                        Stáhnout
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700" 
                        onClick={() => handleDelete(lesson.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Smazat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center p-8 mb-8">
            <p className="text-gray-500 mb-4">
              {selectedSchool !== 'all' || searchTerm
                ? 'Pro vybrané filtry nebyly nalezeny žádné hodiny.' 
                : 'Zatím nemáte uložené žádné hodiny'}
            </p>
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
