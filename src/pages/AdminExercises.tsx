
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import MainLayout from '@/components/MainLayout';
import { useToast } from '@/hooks/use-toast';
import { getConstructs, createConstruct, updateConstruct, deleteConstruct } from '@/services/supabaseService';
import { Plus, Edit, Save, X, FileText } from 'lucide-react';

const AdminExercises: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [constructs, setConstructs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newConstruct, setNewConstruct] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  // Kontrola, zda je uživatel přihlášen jako admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    loadConstructs();
  }, [navigate]);

  const loadConstructs = async () => {
    setIsLoading(true);
    const constructsData = await getConstructs();
    setConstructs(constructsData);
    setIsLoading(false);
  };

  const handleAddConstruct = async () => {
    if (newConstruct.name.trim() === '') {
      toast({
        title: "Chyba",
        description: "Název konstruktu nemůže být prázdný",
        variant: "destructive"
      });
      return;
    }

    const result = await createConstruct(newConstruct.name, newConstruct.description);
    
    if (result) {
      setConstructs([...constructs, result]);
      setNewConstruct({ name: '', description: '' });
      setIsAdding(false);
      
      toast({
        title: "Konstrukt přidán",
        description: `Konstrukt "${result.name}" byl úspěšně přidán`,
      });
    }
  };

  const handleEditConstruct = async () => {
    if (!editingId) return;
    
    if (editForm.name.trim() === '') {
      toast({
        title: "Chyba",
        description: "Název konstruktu nemůže být prázdný",
        variant: "destructive"
      });
      return;
    }

    const result = await updateConstruct(editingId, editForm.name, editForm.description);
    
    if (result) {
      setConstructs(constructs.map(construct => 
        construct.id === editingId ? { ...construct, name: result.name, description: result.description } : construct
      ));
      
      setEditingId(null);
      toast({
        title: "Konstrukt upraven",
        description: "Konstrukt byl úspěšně upraven",
      });
    }
  };

  const handleDeleteConstruct = async (id: number) => {
    const success = await deleteConstruct(id);
    
    if (success) {
      setConstructs(constructs.filter(construct => construct.id !== id));
      toast({
        title: "Konstrukt smazán",
        description: "Konstrukt byl úspěšně smazán",
      });
    }
  };

  const startEditing = (construct: any) => {
    setEditingId(construct.id);
    setEditForm({ name: construct.name, description: construct.description || '' });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleViewItems = (constructId: number) => {
    navigate(`/admin/construct-items/${constructId}`);
  };

  return (
    <MainLayout isAdmin={true}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Správa konstruktů a cvičení</h1>
          <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
            Zpět na dashboard
          </Button>
        </div>
        
        <Card className="shadow-md mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Konstrukty pro hlavní část hodiny</span>
              <Button 
                onClick={() => setIsAdding(!isAdding)}
                variant="outline"
                size="sm"
              >
                {isAdding ? 'Zrušit' : 'Přidat konstrukt'}
                {!isAdding && <Plus className="ml-2" size={16} />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAdding && (
              <div className="bg-gray-50 p-4 mb-4 rounded-md border">
                <h3 className="font-semibold mb-2">Nový konstrukt</h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Název</label>
                    <Input
                      id="name"
                      value={newConstruct.name}
                      onChange={(e) => setNewConstruct({ ...newConstruct, name: e.target.value })}
                      placeholder="Název konstruktu"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Popis</label>
                    <Input
                      id="description"
                      value={newConstruct.description}
                      onChange={(e) => setNewConstruct({ ...newConstruct, description: e.target.value })}
                      placeholder="Popis konstruktu"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleAddConstruct} className="mt-2">
                      Přidat
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-6">
                Načítání konstruktů...
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Název</TableHead>
                    <TableHead>Popis</TableHead>
                    <TableHead className="w-[160px] text-right">Akce</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {constructs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6">
                        Žádné konstrukty nebyly nalezeny
                      </TableCell>
                    </TableRow>
                  ) : (
                    constructs.map(construct => (
                      <TableRow key={construct.id}>
                        <TableCell>
                          {editingId === construct.id ? (
                            <Input 
                              value={editForm.name} 
                              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            />
                          ) : (
                            construct.name
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === construct.id ? (
                            <Input 
                              value={editForm.description} 
                              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            />
                          ) : (
                            construct.description
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {editingId === construct.id ? (
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={handleEditConstruct}>
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
                                className="flex items-center" 
                                onClick={() => handleViewItems(construct.id)}
                              >
                                <FileText size={16} className="mr-1" />
                                Položky
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => startEditing(construct)}>
                                <Edit size={16} />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteConstruct(construct.id)}>
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
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminExercises;
