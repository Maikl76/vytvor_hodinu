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
import { getEnvironments, createEnvironment, updateEnvironment, deleteEnvironment, 
         getEquipment, createEquipment, updateEquipment, deleteEquipment } from '@/services/supabaseService';

const AdminEnvironments: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('environments');
  const [isLoading, setIsLoading] = useState(true);
  
  // Prostředí
  const [environments, setEnvironments] = useState<Array<{id: number, name: string}>>([]);
  const [newEnvironment, setNewEnvironment] = useState({ name: '' });
  const [isAddingEnvironment, setIsAddingEnvironment] = useState(false);
  const [editingEnvironmentId, setEditingEnvironmentId] = useState<number | null>(null);
  const [editEnvironmentForm, setEditEnvironmentForm] = useState({ name: '' });
  
  // Vybavení
  const [equipment, setEquipment] = useState<Array<{id: number, name: string}>>([]);
  const [newEquipment, setNewEquipment] = useState({ name: '' });
  const [isAddingEquipment, setIsAddingEquipment] = useState(false);
  const [editingEquipmentId, setEditingEquipmentId] = useState<number | null>(null);
  const [editEquipmentForm, setEditEquipmentForm] = useState({ name: '' });

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    setIsLoading(true);
    const [environmentsData, equipmentData] = await Promise.all([
      getEnvironments(),
      getEquipment()
    ]);
    
    setEnvironments(environmentsData);
    setEquipment(equipmentData);
    setIsLoading(false);
  };

  // Funkce pro správu prostředí
  const handleAddEnvironment = async () => {
    if (newEnvironment.name.trim() === '') {
      toast({
        title: "Chyba",
        description: "Název prostředí nemůže být prázdný",
        variant: "destructive"
      });
      return;
    }

    const result = await createEnvironment(newEnvironment.name);
    
    if (result) {
      setEnvironments([...environments, result]);
      setNewEnvironment({ name: '' });
      setIsAddingEnvironment(false);
      
      toast({
        title: "Prostředí přidáno",
        description: `Prostředí "${result.name}" bylo úspěšně přidáno.`,
      });
    }
  };

  const handleDeleteEnvironment = async (id: number) => {
    const success = await deleteEnvironment(id);
    
    if (success) {
      setEnvironments(environments.filter(env => env.id !== id));
      toast({
        title: "Prostředí smazáno",
        description: "Prostředí bylo úspěšně smazáno.",
      });
    }
  };

  const startEditingEnvironment = (environment: {id: number, name: string}) => {
    setEditingEnvironmentId(environment.id);
    setEditEnvironmentForm({ name: environment.name });
  };

  const cancelEditingEnvironment = () => {
    setEditingEnvironmentId(null);
  };

  const saveEditEnvironment = async () => {
    if (!editingEnvironmentId) return;
    
    if (editEnvironmentForm.name.trim() === '') {
      toast({
        title: "Chyba",
        description: "Název prostředí nemůže být prázdný",
        variant: "destructive"
      });
      return;
    }

    const result = await updateEnvironment(editingEnvironmentId, editEnvironmentForm.name);
    
    if (result) {
      setEnvironments(environments.map(env => 
        env.id === editingEnvironmentId 
          ? { ...env, name: result.name }
          : env
      ));
      
      setEditingEnvironmentId(null);
      toast({
        title: "Prostředí upraveno",
        description: "Prostředí bylo úspěšně upraveno.",
      });
    }
  };

  // Funkce pro správu vybavení
  const handleAddEquipment = async () => {
    if (newEquipment.name.trim() === '') {
      toast({
        title: "Chyba",
        description: "Název vybavení nemůže být prázdný",
        variant: "destructive"
      });
      return;
    }

    const result = await createEquipment(newEquipment.name);
    
    if (result) {
      setEquipment([...equipment, result]);
      setNewEquipment({ name: '' });
      setIsAddingEquipment(false);
      
      toast({
        title: "Vybavení přidáno",
        description: `Vybavení "${result.name}" bylo úspěšně přidáno.`,
      });
    }
  };

  const handleDeleteEquipment = async (id: number) => {
    const success = await deleteEquipment(id);
    
    if (success) {
      setEquipment(equipment.filter(eq => eq.id !== id));
      toast({
        title: "Vybavení smazáno",
        description: "Vybavení bylo úspěšně smazáno.",
      });
    }
  };

  const startEditingEquipment = (eq: {id: number, name: string}) => {
    setEditingEquipmentId(eq.id);
    setEditEquipmentForm({ name: eq.name });
  };

  const cancelEditingEquipment = () => {
    setEditingEquipmentId(null);
  };

  const saveEditEquipment = async () => {
    if (!editingEquipmentId) return;
    
    if (editEquipmentForm.name.trim() === '') {
      toast({
        title: "Chyba",
        description: "Název vybavení nemůže být prázdný",
        variant: "destructive"
      });
      return;
    }

    const result = await updateEquipment(editingEquipmentId, editEquipmentForm.name);
    
    if (result) {
      setEquipment(equipment.map(eq => 
        eq.id === editingEquipmentId 
          ? { ...eq, name: result.name }
          : eq
      ));
      
      setEditingEquipmentId(null);
      toast({
        title: "Vybavení upraveno",
        description: "Vybavení bylo úspěšně upraveno.",
      });
    }
  };

  return (
    <MainLayout isAdmin={true}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Správa prostředí a vybavení</h1>
          <Button 
            variant="outline"
            onClick={() => navigate('/admin')}
          >
            Zpět na dashboard
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="environments">Prostředí</TabsTrigger>
            <TabsTrigger value="equipment">Vybavení</TabsTrigger>
          </TabsList>

          <TabsContent value="environments">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Prostředí pro tělesnou výchovu</span>
                  <Button 
                    onClick={() => setIsAddingEnvironment(!isAddingEnvironment)} 
                    variant="outline"
                    size="sm"
                  >
                    {isAddingEnvironment ? 'Zrušit' : 'Přidat prostředí'}
                    {!isAddingEnvironment && <Plus className="ml-2" size={16} />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAddingEnvironment && (
                  <div className="bg-gray-50 p-4 mb-4 rounded-md border">
                    <h3 className="font-semibold mb-2">Nové prostředí</h3>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="envName" className="block text-sm font-medium text-gray-700 mb-1">Název</label>
                        <Input
                          id="envName"
                          value={newEnvironment.name}
                          onChange={(e) => setNewEnvironment({ name: e.target.value })}
                          placeholder="Název prostředí"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleAddEnvironment} className="mt-2">
                          Přidat
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Název prostředí</TableHead>
                      <TableHead className="w-[120px] text-right">Akce</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-6">
                          Načítání...
                        </TableCell>
                      </TableRow>
                    ) : environments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-6">
                          Žádná prostředí nebyla nalezena
                        </TableCell>
                      </TableRow>
                    ) : (
                      environments.map(env => (
                        <TableRow key={env.id}>
                          <TableCell>
                            {editingEnvironmentId === env.id ? (
                              <Input 
                                value={editEnvironmentForm.name} 
                                onChange={(e) => setEditEnvironmentForm({name: e.target.value})}
                              />
                            ) : (
                              env.name
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {editingEnvironmentId === env.id ? (
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={saveEditEnvironment}>
                                  <Save size={16} />
                                </Button>
                                <Button variant="outline" size="sm" onClick={cancelEditingEnvironment}>
                                  <X size={16} />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => startEditingEnvironment(env)}>
                                  <Edit size={16} />
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteEnvironment(env.id)}>
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

          <TabsContent value="equipment">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Vybavení pro tělesnou výchovu</span>
                  <Button 
                    onClick={() => setIsAddingEquipment(!isAddingEquipment)} 
                    variant="outline"
                    size="sm"
                  >
                    {isAddingEquipment ? 'Zrušit' : 'Přidat vybavení'}
                    {!isAddingEquipment && <Plus className="ml-2" size={16} />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAddingEquipment && (
                  <div className="bg-gray-50 p-4 mb-4 rounded-md border">
                    <h3 className="font-semibold mb-2">Nové vybavení</h3>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="eqName" className="block text-sm font-medium text-gray-700 mb-1">Název</label>
                        <Input
                          id="eqName"
                          value={newEquipment.name}
                          onChange={(e) => setNewEquipment({ name: e.target.value })}
                          placeholder="Název vybavení"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleAddEquipment} className="mt-2">
                          Přidat
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Název vybavení</TableHead>
                      <TableHead className="w-[120px] text-right">Akce</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-6">
                          Načítání...
                        </TableCell>
                      </TableRow>
                    ) : equipment.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-6">
                          Žádné vybavení nebylo nalezeno
                        </TableCell>
                      </TableRow>
                    ) : (
                      equipment.map(eq => (
                        <TableRow key={eq.id}>
                          <TableCell>
                            {editingEquipmentId === eq.id ? (
                              <Input 
                                value={editEquipmentForm.name} 
                                onChange={(e) => setEditEquipmentForm({name: e.target.value})}
                              />
                            ) : (
                              eq.name
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {editingEquipmentId === eq.id ? (
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={saveEditEquipment}>
                                  <Save size={16} />
                                </Button>
                                <Button variant="outline" size="sm" onClick={cancelEditingEquipment}>
                                  <X size={16} />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => startEditingEquipment(eq)}>
                                  <Edit size={16} />
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteEquipment(eq.id)}>
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
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminEnvironments;
