
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/MainLayout';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Save, X } from 'lucide-react';
import { getConstructItems, createConstructItem, updateConstructItem, deleteConstructItem } from '@/services/supabaseService';
import { ConstructItemRow } from '@/integrations/supabase/client';

const AdminPreparationFinish: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [items, setItems] = useState<ConstructItemRow[]>([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', duration: 5, phase: 'preparation' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', duration: 5, phase: 'preparation' });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('preparation');

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }

    loadItems();
  }, [navigate]);

  const loadItems = async () => {
    setIsLoading(true);
    
    try {
      // Explicitly pass null for construct_id to get standalone items
      const allItems = await getConstructItems(null);
      setItems(allItems);
      console.log("Loaded items:", allItems);
    } catch (error) {
      toast({
        title: "Chyba při načítání dat",
        description: "Nepodařilo se načíst data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (newItem.name.trim() === '') {
      toast({
        title: "Chyba",
        description: "Název položky nemůže být prázdný",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await createConstructItem(
        newItem.name,
        newItem.description,
        null, // Explicitly pass NULL construct_id for standalone items
        newItem.phase,
        newItem.duration
      );
      
      if (result) {
        setItems([...items, result as ConstructItemRow]);
        setNewItem({ name: '', description: '', duration: 5, phase: activeTab });
        setIsAdding(false);
        
        toast({
          title: "Položka přidána",
          description: `Položka "${result.name}" byla úspěšně přidána.`,
        });
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Chyba při přidání položky",
        description: "Nepodařilo se přidat položku",
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      const success = await deleteConstructItem(id);
      
      if (success) {
        setItems(items.filter(item => item.id !== id));
        toast({
          title: "Položka smazána",
          description: "Položka byla úspěšně smazána.",
        });
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Chyba při mazání položky",
        description: "Nepodařilo se smazat položku",
        variant: "destructive"
      });
    }
  };

  const startEditing = (item: ConstructItemRow) => {
    setEditingId(item.id);
    setEditForm({ 
      name: item.name, 
      description: item.description || '', 
      duration: item.duration,
      phase: item.phase || 'preparation'
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    
    if (editForm.name.trim() === '') {
      toast({
        title: "Chyba",
        description: "Název položky nemůže být prázdný",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await updateConstructItem(
        editingId,
        editForm.name,
        editForm.description,
        editForm.phase,
        editForm.duration
      );
      
      if (result) {
        setItems(items.map(item => 
          item.id === editingId 
            ? { ...item, name: result.name, description: result.description, duration: result.duration, phase: result.phase }
            : item
        ));
        
        setEditingId(null);
        toast({
          title: "Položka upravena",
          description: "Položka byla úspěšně upravena.",
        });
      }
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Chyba při úpravě položky",
        description: "Nepodařilo se upravit položku",
        variant: "destructive"
      });
    }
  };

  // Filter items based on the selected phase
  const filteredItems = items.filter(item => item.phase === activeTab);

  return (
    <MainLayout isAdmin={true}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Přípravná a závěrečná část</h1>
          <Button 
            variant="outline"
            onClick={() => navigate('/admin')}
          >
            Zpět na přehled
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="preparation" className="flex-1">Přípravná část</TabsTrigger>
            <TabsTrigger value="finish" className="flex-1">Závěrečná část</TabsTrigger>
          </TabsList>

          {['preparation', 'finish'].map((phase) => (
            <TabsContent key={phase} value={phase}>
              <Card className="mb-8 shadow-md">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>
                      {phase === 'preparation' ? 'Přípravná část' : 'Závěrečná část'}
                    </span>
                    <Button 
                      onClick={() => {
                        setIsAdding(!isAdding);
                        setNewItem({ ...newItem, phase });
                      }}
                      variant="outline"
                      size="sm"
                    >
                      {isAdding ? 'Zrušit' : 'Přidat položku'}
                      {!isAdding && <Plus className="ml-2" size={16} />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isAdding && activeTab === phase && (
                    <div className="bg-gray-50 p-4 mb-4 rounded-md border">
                      <h3 className="font-semibold mb-2">Nová položka</h3>
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Název</label>
                          <Input
                            id="name"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            placeholder="Název položky"
                          />
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Popis</label>
                          <Input
                            id="description"
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            placeholder="Popis položky"
                          />
                        </div>
                        <div>
                          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Trvání (minuty)</label>
                          <Input
                            id="duration"
                            type="number"
                            min="1"
                            value={newItem.duration}
                            onChange={(e) => setNewItem({ ...newItem, duration: parseInt(e.target.value) || 1 })}
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={handleAddItem} className="mt-2">
                            Přidat
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Název</TableHead>
                        <TableHead>Popis</TableHead>
                        <TableHead>Trvání (min)</TableHead>
                        <TableHead className="w-[120px] text-right">Akce</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6">
                            Načítání...
                          </TableCell>
                        </TableRow>
                      ) : filteredItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6">
                            Žádné položky nebyly nalezeny v této sekci
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>
                              {editingId === item.id ? (
                                <Input 
                                  value={editForm.name} 
                                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                />
                              ) : (
                                item.name
                              )}
                            </TableCell>
                            <TableCell>
                              {editingId === item.id ? (
                                <Input 
                                  value={editForm.description} 
                                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                />
                              ) : (
                                item.description
                              )}
                            </TableCell>
                            <TableCell>
                              {editingId === item.id ? (
                                <Input 
                                  type="number"
                                  min="1"
                                  value={editForm.duration} 
                                  onChange={(e) => setEditForm({...editForm, duration: parseInt(e.target.value) || 1})}
                                />
                              ) : (
                                item.duration
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {editingId === item.id ? (
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
                                  <Button variant="outline" size="sm" onClick={() => startEditing(item)}>
                                    <Edit size={16} />
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteItem(item.id)}>
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
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminPreparationFinish;
