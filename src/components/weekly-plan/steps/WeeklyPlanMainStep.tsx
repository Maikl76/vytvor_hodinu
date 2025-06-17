
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, ArrowLeft } from 'lucide-react';
import { getConstructItems } from '@/services/supabaseService';

interface WeeklyPlanMainStepProps {
  selectedItems: number[];
  availableConstructs: any[];
  setSelectedItems: (items: number[]) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  isLoading: boolean;
}

const WeeklyPlanMainStep: React.FC<WeeklyPlanMainStepProps> = ({
  selectedItems,
  availableConstructs,
  setSelectedItems,
  goToNextStep,
  goToPrevStep,
  isLoading: loadingProp
}) => {
  const [activeConstructId, setActiveConstructId] = useState<number | null>(null);
  const [constructItems, setConstructItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (availableConstructs.length > 0 && !activeConstructId) {
      setActiveConstructId(availableConstructs[0].id);
    }
  }, [availableConstructs, activeConstructId]);

  useEffect(() => {
    // Načtení položek hlavní části podle vybraného konstruktu
    const loadConstructItems = async () => {
      if (!activeConstructId) return;
      
      try {
        setIsLoading(true);
        // Načíst položky pro vybraný konstrukt
        const items = await getConstructItems(activeConstructId);
        setConstructItems(items.filter(item => item.phase === 'main' || !item.phase));
      } catch (error) {
        console.error('Error loading construct items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConstructItems();
  }, [activeConstructId]);

  const handleItemToggle = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const filteredItems = constructItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Výběr aktivit pro hlavní část</h2>
      <p className="text-gray-600">
        Vyberte aktivity pro hlavní část hodin více týdenního plánu podle konstruktu.
      </p>

      {availableConstructs.length > 0 && (
        <Tabs 
          defaultValue={activeConstructId?.toString() || availableConstructs[0].id.toString()} 
          onValueChange={(value) => setActiveConstructId(Number(value))}
        >
          <div className="overflow-x-auto">
            <TabsList className="mb-4 inline-flex w-auto min-w-full">
              {availableConstructs.map(construct => (
                <TabsTrigger 
                  key={construct.id} 
                  value={construct.id.toString()}
                  className="whitespace-nowrap px-4"
                >
                  {construct.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {availableConstructs.map(construct => (
            <TabsContent key={construct.id} value={construct.id.toString()}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Hledat aktivity..."
                  className="w-full px-4 py-2 border rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2">
                {isLoading || loadingProp ? (
                  <div className="col-span-2 flex justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <Card
                      key={item.id}
                      className={`p-4 cursor-pointer border-2 hover:bg-gray-50 ${
                        selectedItems.includes(item.id) ? 'border-primary' : 'border-transparent'
                      }`}
                      onClick={() => handleItemToggle(item.id)}
                    >
                      <div className="flex items-start">
                        {selectedItems.includes(item.id) && (
                          <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                        )}
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                          <p className="text-gray-500 text-xs mt-1">Doba trvání: {item.duration} min</p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="col-span-2 text-center text-gray-500">
                    {searchQuery ? "Žádné aktivity neodpovídají vašemu vyhledávání" : "Žádné aktivity nejsou k dispozici"}
                  </p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={goToPrevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zpět
        </Button>
        <Button onClick={goToNextStep}>
          Pokračovat
          <Check className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WeeklyPlanMainStep;
