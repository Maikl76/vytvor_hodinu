
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, FileText, Trash2, Filter, School, GraduationCap, Clock, Eye, Zap } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import MainLayout from '@/components/MainLayout';
import { getWeeklyPlans, deleteWeeklyPlan, getGeneratedLessons } from '@/services/weeklyPlanService';
import { useToast } from '@/hooks/use-toast';
import { WeeklyPlanRow } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';

const WeeklyPlansHistory: React.FC = () => {
  const [plans, setPlans] = useState<WeeklyPlanRow[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<WeeklyPlanRow[]>([]);
  const [schools, setSchools] = useState<{id: number, name: string}[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [sortType, setSortType] = useState<string>('date');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load schools
  useEffect(() => {
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
    
    loadSchools();
  }, []);

  const loadPlans = async () => {
    setIsLoading(true);
    const plansData = await getWeeklyPlans();
    setPlans(plansData);
    setFilteredPlans(plansData);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPlans();
  }, []);
  
  // Filter and sort plans when filters change
  useEffect(() => {
    let filtered = [...plans];
    
    // Filter by school
    if (selectedSchool !== 'all') {
      const schoolId = parseInt(selectedSchool);
      filtered = filtered.filter(plan => plan.school_id === schoolId);
    }
    
    // Filter by search term (only if there's a search term)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(plan => 
        plan.title.toLowerCase().includes(searchLower)
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
    
    setFilteredPlans(filtered);
  }, [selectedSchool, sortType, searchTerm, plans]);

  const handleDeletePlan = async (id: string) => {
    if (!window.confirm('Opravdu chcete smazat tento plán?')) return;
    
    try {
      await deleteWeeklyPlan(id);
      toast({
        title: "Plán smazán",
        description: "Více týdenní plán byl úspěšně smazán.",
      });
      loadPlans();
    } catch (error) {
      toast({
        title: "Chyba při mazání plánu",
        description: "Nepodařilo se smazat více týdenní plán.",
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

  const handleViewPlan = async (plan: any) => {
    const isGenerated = plan.title.includes('(Vygenerováno)');
    
    if (isGenerated) {
      // Pro vygenerované plány přejdeme na zobrazení vygenerovaných hodin
      navigate(`/weekly-plan/${plan.id}`);
    } else {
      // Pro podklady přejdeme na generátor plánu
      navigate(`/weekly-plan-generator/${plan.id}`);
    }
  };

  const getSortTypeLabel = () => {
    switch (sortType) {
      case 'name':
        return 'Název';
      case 'date':
        return 'Datum uložení';
      case 'grade':
        return 'Ročník';
      default:
        return 'Řazení';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Historie více týdenních plánů</h1>
          <Button onClick={() => navigate('/create-weekly-plan')}>
            <Calendar className="mr-2 h-4 w-4" />
            Vytvořit nový plán
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
              <span className="text-gray-500">Hledat podle názvu:</span>
            </div>
            <Input
              type="text"
              placeholder="Hledat podle názvu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredPlans.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-gray-600 mb-4">
              {selectedSchool !== 'all' || searchTerm.trim()
                ? 'Pro vybrané filtry nebyly nalezeny žádné plány.' 
                : 'Zatím nemáte žádné více týdenní plány.'}
            </p>
            <Button onClick={() => navigate('/create-weekly-plan')}>
              Vytvořit první plán
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlans.map((plan) => {
              const isGenerated = plan.title.includes('(Vygenerováno)');
              return (
                <Card key={plan.id} className="overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-xl font-bold truncate pr-2">
                        {isGenerated 
                          ? plan.title.replace(' (Vygenerováno)', '')
                          : plan.title
                        }
                      </h2>
                      <div className="flex flex-col gap-1 flex-shrink-0">
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
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <School className="h-4 w-4 mr-2" />
                        <span>{(plan as any).schools?.name || 'Neuvedeno'}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        <span>{plan.grade}. ročník</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{plan.weeks_count} týdnů, {plan.lessons_per_week} hodin týdně</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Vytvořeno: {formatDate(plan.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 flex justify-between">
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewPlan(plan)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {isGenerated ? 'Zobrazit hodiny' : 'Vygenerovat hodiny'}
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Smazat
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default WeeklyPlansHistory;
