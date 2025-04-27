import { useState } from 'react';

interface SelectionState {
  [size: string]: {
    selected: boolean;
    quantity: number;
  };
}

interface UseProductSelectionReturn {
  selections: SelectionState;
  selectedColor: string | null;
  setSelectedColor: (color: string) => void;
  toggleSelection: (size: string) => void;
  updateQuantity: (size: string, quantity: number) => void;
  getSelectedItems: () => Array<{ size: string; quantity: number }>;
  validateSelections: () => string[];
}

export function useProductSelection(
  availableSizes: string[]
): UseProductSelectionReturn {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selections, setSelections] = useState<SelectionState>(() => {
    const initialState: SelectionState = {};
    availableSizes.forEach((size) => {
      initialState[size] = {
        selected: false,
        quantity: 0,
      };
    });
    return initialState;
  });

  const toggleSelection = (size: string) => {
    setSelections((prev) => ({
      ...prev,
      [size]: {
        ...prev[size],
        selected: !prev[size].selected,
        quantity: !prev[size].selected ? 1 : 0,
      },
    }));
  };

  const updateQuantity = (size: string, quantity: number) => {
    if (!selections[size]?.selected) return;
    
    setSelections((prev) => ({
      ...prev,
      [size]: {
        ...prev[size],
        quantity: Math.max(0, quantity),
      },
    }));
  };

  const getSelectedItems = () => {
    return Object.entries(selections)
      .filter(([_, { selected, quantity }]) => selected && quantity > 0)
      .map(([size, { quantity }]) => ({ size, quantity }));
  };

  const validateSelections = () => {
    const errors: string[] = [];
    const selectedItems = getSelectedItems();

    if (selectedItems.length === 0) {
      errors.push('Please select at least one size and quantity');
    }

    selectedItems.forEach(({ size, quantity }) => {
      if (quantity < 1) {
        errors.push(`Quantity for size ${size} must be at least 1`);
      }
    });

    return errors;
  };

  return {
    selections,
    selectedColor,
    setSelectedColor,
    toggleSelection,
    updateQuantity,
    getSelectedItems,
    validateSelections,
  };
}
