
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, ArrowLeft, Loader2 } from 'lucide-react';
import { getConstructItems, getConstructs } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';

interface MainStepProps {
  constructId: number | null;
  selectedItems: number[];
  setSelectedItems: (items: number[]) => void;
  goToNextStep: () => void;
  setActiveTab: () => void;
  isLoading?: boolean;
  setConstructId?: (id: number | null) => void;
}

const MainStep: React.FC<MainStepProps> = ({
  constructId,
  selectedItems,
  setSelectedItems,
  goToNextStep,
  setActiveTab,
  isLoading = false,
  setConstructId
}) => {
  const [availableConstructs, setAvailableConstructs] = useState<any[]>([]);
  const [constructItems, setConstructItems] = useState<{[key: number]: any[]}>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingItems, setLoadingItems] = useState<{[key: number]: boolean}>({});
  const [activeTabConstructId, setActiveTabConstructId] = useState<number | null>(null);
  const { toast } = useToast();

  // Load constructs
  useEffect(() => {
    const fetchConstructs = async () => {
      try {
        const constructsData = await getConstructs();
        setAvailableConstructs(constructsData);
        
        // Set active tab - prioritize the one from props, otherwise use first available
        if (constructId && constructsData.find(c => c.id === constructId)) {
          setActiveTabConstructId(constructId);
        } else if (constructsData.length > 0) {
          const firstConstruct = constructsData[0];
          setActiveTabConstructId(firstConstruct.id);
          // Set the main constructId to first construct if not set
          if (!constructId && setConstructId) {
            setConstructId(firstConstruct.id);
            console.log(`🎯 MAIN STEP - Setting initial constructId to:`, firstConstruct.id);
          }
        }
      } catch (error) {
        console.error('Error loading constructs:', error);
        toast({
          title: "Chyba při načítání",
          description: "Nepodařilo se načíst cvičební konstrukty.",
          variant: "destructive"
        });
      }
    };
    
    fetchConstructs();
  }, [constructId, setConstructId, toast]);

  // Load construct items for a specific construct
  const loadConstructItems = async (constructId: number) => {
    if (constructItems[constructId]) return; // Already loaded
    
    try {
      setLoadingItems(prev => ({ ...prev, [constructId]: true }));
      // Load ALL items for the construct
      const items = await getConstructItems(constructId);
      console.log(`🎯 MAIN STEP - Loaded ALL items for construct ${constructId}:`, items);
      
      setConstructItems(prev => ({ 
        ...prev, 
        [constructId]: items || []
      }));
      
      console.log(`🎯 MAIN STEP - Set items for construct ${constructId}:`, items || []);
    } catch (error) {
      console.error('Error loading construct items:', error);
      toast({
        title: "Chyba při načítání",
        description: "Nepodařilo se načíst aktivity pro konstrukt.",
        variant: "destructive"
      });
    } finally {
      setLoadingItems(prev => ({ ...prev, [constructId]: false }));
    }
  };

  // Load items when active tab changes
  useEffect(() => {
    if (activeTabConstructId) {
      loadConstructItems(activeTabConstructId);
    }
  }, [activeTabConstructId]);

  const handleItemToggle = (itemId: number) => {
    console.log(`🎯 MAIN STEP - Toggling item ${itemId}, current selected:`, selectedItems);
    if (selectedItems.includes(itemId)) {
      const newSelected = selectedItems.filter(id => id !== itemId);
      setSelectedItems(newSelected);
      console.log(`🎯 MAIN STEP - Removed item ${itemId}, new selected:`, newSelected);
    } else {
      const newSelected = [...selectedItems, itemId];
      setSelectedItems(newSelected);
      console.log(`🎯 MAIN STEP - Added item ${itemId}, new selected:`, newSelected);
    }
  };

  const getFilteredItems = (constructId: number) => {
    const items = constructItems[constructId] || [];
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleTabChange = (value: string) => {
    const newTabConstructId = Number(value);
    setActiveTabConstructId(newTabConstructId);
    
    console.log(`🎯 MAIN STEP - Tab changed to construct:`, newTabConstructId);
    console.log(`🎯 MAIN STEP - Keeping all selected items from all constructs:`, selectedItems);
    
    // NEMĚNÍME hlavní constructId při přepínání tabů - zachováváme původní
    // selectedItems obsahují ID ze všech konstruktů, takže se zachovají
    
    if (!constructItems[newTabConstructId]) {
      loadConstructItems(newTabConstructId);
    }
  };

  useEffect(() => {
    console.log(`🎯 MAIN STEP - Selected items changed:`, selectedItems);
    console.log(`🎯 MAIN STEP - Main constructId (preserved):`, constructId);
    console.log(`🎯 MAIN STEP - Active tab constructId:`, activeTabConstructId);
  }, [selectedItems, constructId, activeTabConstructId]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Hlavní část</h2>
      <p className="text-gray-600">
        Vyberte aktivity pro hlavní část hodiny podle konstruktu. Můžete vybírat aktivity z více konstruktů.
      </p>

      {availableConstructs.length > 0 && (
        <Tabs 
          value={activeTabConstructId?.toString() || ''} 
          onValueChange={handleTabChange}
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
                {loadingItems[construct.id] ? (
                  <div className="col-span-2 flex justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : getFilteredItems(construct.id).length > 0 ? (
                  getFilteredItems(construct.id).map(item => (
                    <Card
                      key={item.id}
                      className={`p-4 cursor-pointer border-2 hover:bg-gray-50 ${
                        selectedItems.includes(item.id) ? 'border-primary bg-blue-50' : 'border-transparent'
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
        <Button variant="outline" onClick={setActiveTab}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zpět
        </Button>
        <Button 
          onClick={goToNextStep}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Zpracování...
            </>
          ) : (
            <>
              Pokračovat
              <Check className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MainStep;
