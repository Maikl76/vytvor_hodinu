
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { getWeeklyPlanById, deleteWeeklyPlan, getGeneratedLessons } from '@/services/weeklyPlanService';
import { exportWeeklyPlanToDocument } from '@/services/weekly-plan';
import { createFavoriteExercise } from '@/services/favoriteExercisesService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Trash,
  CalendarDays,
  School,
  Users,
  MapPin,
  Calendar,
  Eye,
  FileText,
  Download,
  Star
} from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';

const WeeklyPlan: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [plan, setPlan] = useState<any>(null);
  const [generatedLessons, setGeneratedLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  
  useEffect(() => {
    const loadPlanDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const planData = await getWeeklyPlanById(id);
        console.log("Loaded plan data:", planData);
        setPlan(planData);

        // Load generated lessons separately
        const lessons = await getGeneratedLessons(id);
        console.log("Loaded generated lessons:", lessons);
        setGeneratedLessons(lessons);
      } catch (error) {
        console.error("Error loading weekly plan:", error);
        toast({
          title: "Chyba",
          description: "Nepodařilo se načíst data plánu",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPlanDetails();
  }, [id, toast]);
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      const success = await deleteWeeklyPlan(id);
      if (success) {
        toast({
          title: "Plán smazán",
          description: "Více týdenní plán byl úspěšně smazán",
        });
        navigate('/weekly-plans-history');
      } else {
        throw new Error("Nepodařilo se smazat plán");
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se smazat plán",
        variant: "destructive"
      });
    }
  };
  
  const handleGeneratePlan = () => {
    if (id) {
      navigate(`/generate-weekly-plan/${id}`);
    }
  };

  const handleViewLesson = (week: number, lesson: number, lessonData: any) => {
    console.log('Viewing lesson:', { week, lesson, lessonData });
    setSelectedLesson({
      week,
      lesson,
      data: lessonData
    });
    setShowLessonDialog(true);
  };

  const handleDownloadPlan = async () => {
    if (!plan || !id) return;

    try {
      // Convert ALL generated lessons to the format expected by the export function
      const lessonsData: Record<string, any> = {};
      
      console.log('Converting ALL lessons for export:', generatedLessons);
      
      // Process each generated lesson
      generatedLessons.forEach(lesson => {
        const key = `${lesson.week_number}-${lesson.lesson_number}`;
        lessonsData[key] = {
          week: lesson.week_number,
          lessonNumber: lesson.lesson_number,
          exercises: lesson.lesson_data // Use lesson_data directly
        };
      });

      console.log('Converted ALL lessons data for export:', lessonsData);

      // Export document with ALL lessons
      const blob = await exportWeeklyPlanToDocument(id, lessonsData);
      saveAs(blob, `plan_${plan.title.replace(/\s+/g, '_')}.docx`);
      
      toast({
        title: "Stažení dokončeno",
        description: `Plán byl úspěšně stažen jako Word dokument (${Object.keys(lessonsData).length} hodin).`,
      });
    } catch (error) {
      console.error("Error downloading plan:", error);
      toast({
        title: "Chyba při stahování",
        description: "Nepodařilo se stáhnout plán.",
        variant: "destructive"
      });
    }
  };

  
  const renderExercises = (exercises: any, phase: string) => {
    console.log(`Rendering exercises for phase ${phase}:`, exercises);
    
    if (!exercises || !exercises[phase] || exercises[phase].length === 0) {
      return <p className="text-gray-500">Žádná cvičení</p>;
    }

    return (
      <div className="space-y-2">
        {exercises[phase].map((exercise: any, index: number) => (
          <div key={index} className="p-3 bg-gray-50 rounded">
            <h4 className="font-medium">{exercise.name}</h4>
            {exercise.description && (
              <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
            )}
            {exercise.time && (
              <p className="text-xs text-gray-500 mt-1">Doba trvání: {exercise.time} min</p>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <p className="text-center py-8">Načítám data...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!plan) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <Button onClick={() => navigate('/weekly-plans-history')} variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zpět na seznam plánů
          </Button>
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
            <h2 className="text-lg font-medium text-amber-800">Plán nebyl nalezen</h2>
            <p className="text-amber-700 mt-2">
              Požadovaný více týdenní plán nebyl nalezen nebo neexistuje.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const isGeneratedPlan = plan?.title?.includes('(Vygenerováno)');

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <Button onClick={() => navigate('/weekly-plans-history')} variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zpět na seznam plánů
          </Button>
          
          <div className="flex gap-2">
            {isGeneratedPlan && generatedLessons.length > 0 && (
              <Button onClick={handleDownloadPlan} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Stáhnout plán
              </Button>
            )}
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash className="mr-2 h-4 w-4" />
                  Smazat plán
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Opravdu chcete smazat tento plán?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tato akce je nevratná a smaže plán a všechny jeho hodiny.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Zrušit</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Smazat</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button onClick={handleGeneratePlan} className="bg-green-600 hover:bg-green-700">
              <CalendarDays className="mr-2 h-4 w-4" />
              Generovat plán
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{plan.title}</h1>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <School className="mr-1 h-4 w-4" />
              <span>{plan.school?.name || 'Bez školy'}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              <span>{plan.grade}. ročník</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{plan.weeks_count} týdnů / {plan.lessons_per_week} hodin týdně</span>
            </div>
            {plan.environments && plan.environments.length > 0 && (
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                <span>
                  {plan.environments.map((env: any) => env.name).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {isGeneratedPlan ? (
          <Tabs defaultValue="lessons" className="mb-6">
            <TabsList>
              <TabsTrigger value="lessons">Vygenerované hodiny</TabsTrigger>
              <TabsTrigger value="overview">Přehled plánu</TabsTrigger>
            </TabsList>
            
            <TabsContent value="lessons">
              {generatedLessons.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Vygenerované hodiny ({generatedLessons.length})</span>
                      <Button onClick={handleDownloadPlan} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Stáhnout celý plán
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Týden</TableHead>
                          <TableHead>Hodina</TableHead>
                          <TableHead>Počet cvičení</TableHead>
                          <TableHead className="text-right">Akce</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {generatedLessons.map((lesson) => {
                          const exerciseCount = lesson.lesson_data ? 
                            (lesson.lesson_data.preparation?.length || 0) +
                            (lesson.lesson_data.main?.length || 0) +
                            (lesson.lesson_data.finish?.length || 0) : 0;
                          
                          return (
                            <TableRow key={`${lesson.week_number}-${lesson.lesson_number}`}>
                              <TableCell>{lesson.week_number}</TableCell>
                              <TableCell>{lesson.lesson_number}</TableCell>
                              <TableCell>{exerciseCount} cvičení</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewLesson(lesson.week_number, lesson.lesson_number, lesson.lesson_data)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Detail
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">Tento plán zatím nemá žádné vygenerované hodiny.</p>
                      <Button onClick={handleGeneratePlan}>
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Generovat plán
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Přehled plánu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Celkový počet hodin</h3>
                      <p>{plan.weeks_count * plan.lessons_per_week}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Vytvořeno</h3>
                      <p>{new Date(plan.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Vygenerované hodiny</h3>
                      <p>{generatedLessons.length} z {plan.weeks_count * plan.lessons_per_week}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Přehled plánu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Celkový počet hodin</h3>
                  <p>{plan.weeks_count * plan.lessons_per_week}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Vytvořeno</h3>
                  <p>{new Date(plan.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">Toto je původní podklad pro generování plánu.</p>
                <Button onClick={handleGeneratePlan}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Generovat plán
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialog pro zobrazení detailu hodiny */}
        <Dialog open={showLessonDialog} onOpenChange={setShowLessonDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Detail hodiny - Týden {selectedLesson?.week}, Hodina {selectedLesson?.lesson}</span>
                <Button 
                  onClick={handleDownloadPlan} 
                  variant="outline" 
                  size="sm"
                  disabled={!generatedLessons.length}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Stáhnout plán
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            {selectedLesson?.data && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-600">Přípravná část</h3>
                  {renderExercises(selectedLesson.data, 'preparation')}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-600">Hlavní část</h3>
                  {renderExercises(selectedLesson.data, 'main')}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-orange-600">Závěrečná část</h3>
                  {renderExercises(selectedLesson.data, 'finish')}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default WeeklyPlan;
