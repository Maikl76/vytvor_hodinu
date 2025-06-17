import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import MainLayout from '@/components/MainLayout';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Save, X, Settings } from 'lucide-react';
import { getSchools, createSchool, updateSchool, deleteSchool } from '@/services/supabaseService';
import SchoolEquipmentManager from '@/components/admin/SchoolEquipmentManager';

const AdminSchools: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [schools, setSchools] = useState<Array<{id: number, name: string, lessons_per_week: number}>>([]);
  const [newSchool, setNewSchool] = useState({ name: '', lessonsPerWeek: 2 });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', lessonsPerWeek: 2 });
  const [isLoading, setIsLoading] = useState(true);
  const [equipmentManagerOpen, setEquipmentManagerOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<{id: number, name: string} | null>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin-login');
    }
    
    loadSchools();
  }, [navigate]);

  const loadSchools = async () => {
    setIsLoading(true);
    const schoolsData = await getSchools();
    setSchools(schoolsData);
    setIsLoading(false);
  };

  const handleAddSchool = async () => {
    if (newSchool.name.trim() === '') {
      toast({
        title: "Chyba",
        description: "Název školy nemůže být prázdný",
        variant: "destructive"
      });
      return;
    }

    const result = await createSchool(newSchool.name, newSchool.lessonsPerWeek);
    
    if (result) {
      setSchools([...schools, result]);
      setNewSchool({ name: '', lessonsPerWeek: 2 });
      setIsAdding(false);
      
      toast({
        title: "Škola přidána",
        description: `Škola "${result.name}" byla úspěšně přidána.`,
      });
    }
  };

  const handleDeleteSchool = async (id: number) => {
    const success = await deleteSchool(id);
    
    if (success) {
      setSchools(schools.filter(school => school.id !== id));
      toast({
        title: "Škola smazána",
        description: "Škola byla úspěšně smazána.",
      });
    }
  };

  const startEditing = (school: {id: number, name: string, lessons_per_week: number}) => {
    setEditingId(school.id);
    setEditForm({ name: school.name, lessonsPerWeek: school.lessons_per_week });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    
    if (editForm.name.trim() === '') {
      toast({
        title: "Chyba",
        description: "Název školy nemůže být prázdný",
        variant: "destructive"
      });
      return;
    }

    const result = await updateSchool(editingId, editForm.name, editForm.lessonsPerWeek);
    
    if (result) {
      setSchools(schools.map(school => 
        school.id === editingId 
          ? { ...school, name: result.name, lessons_per_week: result.lessons_per_week }
          : school
      ));
      
      setEditingId(null);
      toast({
        title: "Škola upravena",
        description: "Škola byla úspěšně upravena.",
      });
    }
  };

  const openEquipmentManager = (school: {id: number, name: string}) => {
    setSelectedSchool(school);
    setEquipmentManagerOpen(true);
  };

  const closeEquipmentManager = () => {
    setEquipmentManagerOpen(false);
    setSelectedSchool(null);
  };

  return (
    <MainLayout isAdmin={true}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Správa škol</h1>
          <Button 
            variant="outline"
            onClick={() => navigate('/admin')}
          >
            Zpět na dashboard
          </Button>
        </div>

        <Card className="mb-8 shadow-md">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Školy</span>
              <Button 
                onClick={() => setIsAdding(!isAdding)} 
                variant="outline"
                size="sm"
              >
                {isAdding ? 'Zrušit' : 'Přidat školu'}
                {!isAdding && <Plus className="ml-2" size={16} />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAdding && (
              <div className="bg-gray-50 p-4 mb-4 rounded-md border">
                <h3 className="font-semibold mb-2">Nová škola</h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Název</label>
                    <Input
                      id="name"
                      value={newSchool.name}
                      onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                      placeholder="Název školy"
                    />
                  </div>
                  <div>
                    <label htmlFor="lessonsPerWeek" className="block text-sm font-medium text-gray-700 mb-1">
                      Počet hodin týdně
                    </label>
                    <Input
                      id="lessonsPerWeek"
                      type="number"
                      min="1"
                      value={newSchool.lessonsPerWeek}
                      onChange={(e) => setNewSchool({ ...newSchool, lessonsPerWeek: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleAddSchool} className="mt-2">
                      Přidat
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Název školy</TableHead>
                  <TableHead>Počet hodin týdně</TableHead>
                  <TableHead className="w-[160px] text-right">Akce</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6">
                      Načítání...
                    </TableCell>
                  </TableRow>
                ) : schools.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6">
                      Žádné školy nebyly nalezeny
                    </TableCell>
                  </TableRow>
                ) : (
                  schools.map(school => (
                    <TableRow key={school.id}>
                      <TableCell>
                        {editingId === school.id ? (
                          <Input 
                            value={editForm.name} 
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          />
                        ) : (
                          school.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === school.id ? (
                          <Input 
                            type="number"
                            min="1"
                            value={editForm.lessonsPerWeek} 
                            onChange={(e) => setEditForm({...editForm, lessonsPerWeek: parseInt(e.target.value) || 1})}
                          />
                        ) : (
                          school.lessons_per_week
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === school.id ? (
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={saveEdit}>
                              <Save size={16} />
                            </Button>
                            <Button variant="outline" size="sm" onClick={cancelEditing}>
                              <X size={16} />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openEquipmentManager(school)}
                              title="Spravovat vybavení"
                            >
                              <Settings size={16} />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => startEditing(school)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteSchool(school.id)}>
                              <X size={16} />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {selectedSchool && (
          <SchoolEquipmentManager
            schoolId={selectedSchool.id}
            schoolName={selectedSchool.name}
            isOpen={equipmentManagerOpen}
            onClose={closeEquipmentManager}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default AdminSchools;
