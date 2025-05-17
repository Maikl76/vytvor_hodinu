
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ChevronLeft, Loader2 } from 'lucide-react';
import { getConstructItems, getConstructs } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';

interface MainStepProps {
  constructId: number | null;
  selectedItems: number[];
  setSelectedItems: (items: number[]) => void;
  goToNextStep: () => void;
  setActiveTab: () => void;
  isLoading?: boolean;
}

const MainStep: React.FC<MainStepProps> = ({
  constructId,
  selectedItems,
  setSelectedItems,
  goToNextStep,
  setActiveTab,
  isLoading = false
}) => {
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [constructInfo, setConstructInfo] = useState<{ name: string; description: string } | null>(null);
  const { toast } = useToast();

  // Load construct information
  useEffect(() => {
    const fetchConstructInfo = async () => {
      if (!constructId) {
        setConstructInfo(null);
        return;
      }
      
      try {
        console.log("Fetching construct info for ID:", constructId);
        const constructsData = await getConstructs();
        console.log("All constructs:", constructsData);
        
        const selectedConstruct = constructsData.find(
          (construct: any) => construct.id === constructId
        );
        
        console.log("Selected construct:", selectedConstruct);
        
        if (selectedConstruct) {
          setConstructInfo({
            name: selectedConstruct.name,
            description: selectedConstruct.description || ""
          });
          console.log("Set construct info:", { name: selectedConstruct.name, description: selectedConstruct.description });
        } else {
          console.log("Construct not found for ID:", constructId);
          setConstructInfo(null);
        }
      } catch (error) {
        console.error('Error loading construct info:', error);
        setConstructInfo(null);
      }
    };
    
    fetchConstructInfo();
  }, [constructId]);

  // Load main phase items
  useEffect(() => {
    const fetchItems = async () => {
      setLoadingItems(true);
      try {
        // Get ALL items for the phase 'main' without filtering by construct
        const items = await getConstructItems(null, 'main');
        
        if (Array.isArray(items)) {
          console.log("Successfully loaded main items:", items);
          setAvailableItems(items);
        } else {
          console.error('Failed to load main items');
          toast({
            title: "Chyba při načítání",
            description: "Nepodařilo se načíst aktivity pro hlavní část hodiny.",
            variant: "destructive"
          });
          setAvailableItems([]);
        }
      } catch (error) {
        console.error('Error loading main items:', error);
        toast({
          title: "Chyba při načítání",
          description: "Nastala chyba při načítání aktivit.",
          variant: "destructive"
        });
        setAvailableItems([]);
      } finally {
        setLoadingItems(false);
      }
    };
    
    fetchItems();
  }, [toast]);

  // Toggle item selection
  const toggleItem = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Hlavní část</h2>
      <p className="mb-6 text-gray-600">
        Vyberte aktivity pro hlavní část hodiny
      </p>

      {constructId && constructInfo && (
        <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="text-xl font-medium mb-2">{constructInfo.name}</h3>
          {constructInfo.description && (
            <p className="text-gray-700">{constructInfo.description}</p>
          )}
        </div>
      )}

      <h3 className="text-lg font-medium mb-2">Vyberte aktivity:</h3>
      {loadingItems ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3">Načítání aktivit...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {availableItems.length > 0 ? (
            availableItems.map((item) => (
              <Card 
                key={item.id}
                className={`cursor-pointer transition-all ${
                  selectedItems.includes(item.id) 
                    ? 'border-primary border-2' 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => toggleItem(item.id)}
              >
                <CardContent className="p-4 relative">
                  {selectedItems.includes(item.id) && (
                    <Check className="absolute top-2 right-2 text-primary h-5 w-5" />
                  )}
                  <h3 className="font-medium">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 p-6 text-center">
              <p className="text-gray-500">
                Žádné aktivity pro hlavní část nebyly nalezeny
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={setActiveTab}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
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
