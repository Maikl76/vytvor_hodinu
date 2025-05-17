
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ChevronLeft, Loader2 } from 'lucide-react';
import { getConstructItems } from '@/services/supabaseService';

interface FinishStepProps {
  selectedItems: number[];
  setSelectedItems: (items: number[]) => void;
  goToNextStep: () => void;
  setActiveTab: () => void;
  isLoading?: boolean;
}

const FinishStep: React.FC<FinishStepProps> = ({
  selectedItems,
  setSelectedItems,
  goToNextStep,
  setActiveTab,
  isLoading = false
}) => {
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  // Load finish phase items
  useEffect(() => {
    const fetchItems = async () => {
      setLoadingItems(true);
      try {
        // Get items specific to finish phase (standalone items without construct)
        const items = await getConstructItems(null, 'finish');
        if (Array.isArray(items)) {
          setAvailableItems(items);
        } else {
          console.error('Failed to load finish items');
          setAvailableItems([]);
        }
      } catch (error) {
        console.error('Error loading finish items:', error);
        setAvailableItems([]);
      } finally {
        setLoadingItems(false);
      }
    };
    
    fetchItems();
  }, []);

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
      <h2 className="text-2xl font-semibold mb-4">Závěrečná část</h2>
      <p className="mb-6 text-gray-600">
        Vyberte aktivity pro závěrečnou část hodiny
      </p>

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
                Žádné aktivity pro závěrečnou část nebyly nalezeny
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

export default FinishStep;
