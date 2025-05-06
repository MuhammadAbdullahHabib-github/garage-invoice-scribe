
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineItem } from "@/lib/invoice-types";

interface LineItemsTableProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}

export function LineItemsTable({ items, onChange }: LineItemsTableProps) {
  const addLineItem = () => {
    const newItem: LineItem = {
      id: `item_${Date.now()}`,
      particulars: "",
      rate: 0,
      amount: 0,
    };
    onChange([...items, newItem]);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-calculate amount when rate changes (assuming quantity is always 1 for now)
        if (field === 'rate') {
          updatedItem.amount = Number(value);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    onChange(updatedItems);
  };

  const removeLineItem = (id: string) => {
    const filteredItems = items.filter((item) => item.id !== id);
    onChange(filteredItems);
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted border-b">
              <th className="py-2 px-4 text-left w-12">S.No</th>
              <th className="py-2 px-4 text-left">Item</th>
              <th className="py-2 px-4 text-right w-24">Quantity</th>
              <th className="py-2 px-4 text-right w-32">Unit Price</th>
              <th className="py-2 px-4 text-right w-32">Amount</th>
              <th className="py-2 px-4 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="border-b border-dotted hover:bg-muted/50">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">
                  <Input
                    value={item.particulars}
                    onChange={(e) => updateLineItem(item.id, "particulars", e.target.value)}
                    placeholder="Enter item description"
                    className="border-none shadow-none"
                  />
                </td>
                <td className="py-2 px-4">
                  <Input
                    type="number"
                    value="1"
                    className="border-none shadow-none text-right"
                    readOnly
                  />
                </td>
                <td className="py-2 px-4">
                  <Input
                    type="number"
                    value={item.rate || ""}
                    onChange={(e) => updateLineItem(item.id, "rate", Number(e.target.value))}
                    className="border-none shadow-none text-right"
                  />
                </td>
                <td className="py-2 px-4">
                  <Input
                    type="number"
                    value={item.amount || ""}
                    onChange={(e) => updateLineItem(item.id, "amount", Number(e.target.value))}
                    className="border-none shadow-none text-right"
                  />
                </td>
                <td className="py-2 px-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLineItem(item.id)}
                    className="h-8 w-8 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-muted-foreground">
                  No items added yet. Click "Add New Line" to add an item.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Button
        variant="outline"
        className="text-green-600 border-dashed border-green-400 flex items-center"
        onClick={addLineItem}
      >
        <span className="mr-1 text-lg">+</span> Add New Line
      </Button>
    </div>
  );
}
