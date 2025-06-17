import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import MainLayout from '@/components/MainLayout';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Save, X } from 'lucide-react';
import { getConstructs, getConstructItems, createConstructItem, updateConstructItem, deleteConstructItem } from '@/services/supabaseService';
import { ConstructItemRow } from '@/types/supabase';

const AdminConstructItems: React.FC = () => {
  const navigate = useNavigate();
  const { constructId } = useParams<{ constructId: string }>();
  const { toast } = useToast();
  
  const [construct, setConstruct] = useState<{ id: number, name: string, description: string | null } | null>(null);
  const [items, setItems] = useState<ConstructItemRow[]>([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', duration: 5 });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', duration: 5 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }

    // Načtení konstruktu a jeho položek
    if (constructId) {
      loadData(parseInt(constructId));
    } else {
      navigate('/admin/exercises');
    }
  }, [constructId, navigate]);

  const loadData = async (id: number) => {
    setIsLoading(true);
    
    try {
      const constructs = await getConstructs();
      const foundConstruct = constructs.find(c => c.id === id);
      
      if (foundConstruct) {
        setConstruct(foundConstruct);
        const itemsData = await getConstructItems(id);
        setItems(itemsData as ConstructItemRow[]);
      } else {
        navigate('/admin/exercises');
        toast({
          title: "Chyba",
          description: "Konstrukt nebyl nalezen",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Chyba při načítání dat",
        description: "Nepodařilo se načíst data konstruktu",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!construct) return;
    
    if (newItem.name.trim() === '') {
      toast({
        title: "Chyba",
        description: "Název položky nemůže být prázdný",
        variant: "destructive"
      });
      return;
    }

    const result = await createConstructItem(
      newItem.name,
      newItem.description,
      construct.id,
      'main', // All items in this view are for main phase
      newItem.duration
    );
    
    if (result) {
      setItems([...items, result as ConstructItemRow]);
      setNewItem({ name: '', description: '', duration: 5 });
      setIsAdding(false);
      
      toast({
        title: "Položka přidána",
        description: `Položka "${result.name}" byla úspěšně přidána.`,
      });
    }
  };

  const handleDeleteItem = async (id: number) => {
    const success = await deleteConstructItem(id);
    
    if (success) {
      setItems(items.filter(item => item.id !== id));
      toast({
        title: "Položka smazána",
        description: "Položka byla úspěšně smazána.",
      });
    }
  };

  const startEditing = (item: ConstructItemRow) => {
    setEditingId(item.id);
    setEditForm({ 
      name: item.name, 
      description: item.description || '', 
      duration: item.duration
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

    const result = await updateConstructItem(
      editingId,
      editForm.name,
      editForm.description,
      'main',
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
  };

  if (isLoading) {
    return (
      <MainLayout isAdmin={true}>
        <div className="max-w-4xl mx-auto">
          <p className="text-center py-10">Načítání...</p>
        </div>
      </MainLayout>
    );
  }

  if (!construct) {
    return (
      <MainLayout isAdmin={true}>
        <div className="max-w-4xl mx-auto">
          <p className="text-center py-10">Konstrukt nebyl nalezen</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isAdmin={true}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">{construct.name}</h1>
            <p className="text-gray-600">{construct.description}</p>
          </div>
          <Button 
            variant="outline"
            onClick={() => navigate('/admin/exercises')}
          >
            Zpět na konstrukty
          </Button>
        </div>

        <Card className="mb-8 shadow-md">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Položky konstruktu</span>
              <Button 
                onClick={() => setIsAdding(!isAdding)}
                variant="outline"
                size="sm"
              >
                {isAdding ? 'Zrušit' : 'Přidat položku'}
                {!isAdding && <Plus className="ml-2" size={16} />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAdding && (
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
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      Žádné položky nebyly nalezeny
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map(item => (
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
      </div>
    </MainLayout>
  );
};

export default AdminConstructItems;
