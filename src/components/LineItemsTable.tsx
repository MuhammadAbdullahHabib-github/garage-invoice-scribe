
import { useState } from "react";
import { Trash } from "lucide-react";
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
        
        // If rate is updated, recalculate amount
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
      <div className="border rounded-md">
        <table className="w-full">
          <thead>
            <tr className="bg-muted border-b">
              <th className="py-2 px-4 text-left w-16">S.No</th>
              <th className="py-2 px-4 text-left">PARTICULARS</th>
              <th className="py-2 px-4 text-right w-24">Rate</th>
              <th className="py-2 px-4 text-right w-32">Amount (Rs & P.)</th>
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
                    className="border-none"
                  />
                </td>
                <td className="py-2 px-4">
                  <Input
                    type="number"
                    value={item.rate || ""}
                    onChange={(e) => updateLineItem(item.id, "rate", Number(e.target.value))}
                    className="border-none text-right"
                  />
                </td>
                <td className="py-2 px-4">
                  <Input
                    type="number"
                    value={item.amount || ""}
                    onChange={(e) => updateLineItem(item.id, "amount", Number(e.target.value))}
                    className="border-none text-right"
                  />
                </td>
                <td className="py-2 px-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLineItem(item.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button
        variant="outline"
        className="text-garage-primary border-dashed border-garage-primary"
        onClick={addLineItem}
      >
        + Add New Line
      </Button>
    </div>
  );
}
