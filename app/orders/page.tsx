'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

type ItemWithInventory = {
  id: string;
  name: string;
  unitPrice: number;
  inventory?: {
    quantity: number;
  } | null;
};

type OrderItemForm = {
  itemId: string;
  quantity: number;
};

const orderSchema = z.object({
  userId: z.string().min(1, 'Kund*innen-ID wird benötigt'),
  items: z
    .array(
      z.object({
        itemId: z.string().min(1, 'Artikel auswählen'),
        quantity: z.number().int().positive('Menge muss größer 0 sein')
      })
    )
    .min(1, 'Mindestens ein Artikel auswählen')
});

export default function OrdersPage() {
  const [items, setItems] = useState<ItemWithInventory[]>([]);
  const [userId, setUserId] = useState('');
  const [selected, setSelected] = useState<OrderItemForm[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadItems() {
      const response = await fetch('/api/items');
      if (!response.ok) {
        setError('Artikel konnten nicht geladen werden');
        return;
      }
      const data = (await response.json()) as ItemWithInventory[];
      setItems(
        data.map((item) => ({
          ...item,
          unitPrice: Number(item.unitPrice)
        }))
      );
    }

    loadItems().catch((err) => {
      console.error(err);
      setError('Unbekannter Fehler beim Laden der Artikel');
    });
  }, []);

  const totalPrice = useMemo(() => {
    return selected.reduce((sum, entry) => {
      const item = items.find((option) => option.id === entry.itemId);
      if (!item) return sum;
      return sum + item.unitPrice * entry.quantity;
    }, 0);
  }, [items, selected]);

  const handleAddItem = () => {
    setSelected((prev) => [...prev, { itemId: '', quantity: 1 }]);
  };

  const handleItemChange = (index: number, changes: Partial<OrderItemForm>) => {
    setSelected((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? { ...item, ...changes } : item))
    );
  };

  const handleRemoveItem = (index: number) => {
    setSelected((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const validateStock = (entries: OrderItemForm[]) => {
    const outOfStock = entries.filter((entry) => {
      const item = items.find((option) => option.id === entry.itemId);
      if (!item) return true;
      const available = item.inventory?.quantity ?? 0;
      return entry.quantity > available;
    });

    if (outOfStock.length > 0) {
      const details = outOfStock
        .map((entry) => {
          const item = items.find((option) => option.id === entry.itemId);
          return `${item?.name ?? entry.itemId}: verfügbar ${item?.inventory?.quantity ?? 0}`;
        })
        .join(', ');
      throw new Error(`Mengen übersteuern den Bestand (${details})`);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const data = orderSchema.parse({
        userId,
        items: selected
      });
      validateStock(data.items);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message ?? 'Bestellung konnte nicht angelegt werden');
      }

      setMessage('Bestellung wurde erfolgreich erstellt.');
      setSelected([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Neue Bestellung anlegen</h2>
        <p className="text-sm text-slate-600">
          Wählen Sie Artikel und Mengen aus. Es können nur verfügbare Lagerbestände bestellt
          werden.
        </p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow">
        <label className="block text-sm font-medium text-slate-700">
          Kund*innen-ID
          <input
            type="text"
            className="mt-1 w-full rounded border border-slate-300 p-2"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            required
          />
        </label>
        <div className="space-y-4">
          {selected.map((entry, index) => {
            const inventory = items.find((item) => item.id === entry.itemId)?.inventory?.quantity ?? 0;
            return (
              <div key={index} className="grid gap-4 md:grid-cols-[2fr_1fr_auto]">
                <label className="flex flex-col text-sm font-medium text-slate-700">
                  Artikel
                  <select
                    className="mt-1 rounded border border-slate-300 p-2"
                    value={entry.itemId}
                    onChange={(event) =>
                      handleItemChange(index, { itemId: event.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Bitte wählen
                    </option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} (verfügbar: {item.inventory?.quantity ?? 0})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col text-sm font-medium text-slate-700">
                  Menge
                  <input
                    type="number"
                    min={1}
                    className="mt-1 rounded border border-slate-300 p-2"
                    value={entry.quantity}
                    onChange={(event) =>
                      handleItemChange(index, { quantity: Number(event.target.value) })
                    }
                    required
                  />
                </label>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="rounded border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Entfernen
                  </button>
                </div>
                <p className="md:col-span-3 text-sm text-slate-500">
                  Verfügbar: {inventory} Stück
                </p>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="rounded border border-blue-200 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
        >
          Artikel hinzufügen
        </button>
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <span className="text-lg font-semibold">Gesamt: {totalPrice.toFixed(2)} €</span>
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            disabled={selected.length === 0}
          >
            Bestellung abschicken
          </button>
        </div>
        {message && <p className="rounded bg-green-100 p-3 text-sm text-green-700">{message}</p>}
        {error && <p className="rounded bg-red-100 p-3 text-sm text-red-700">{error}</p>}
      </form>
    </section>
  );
}
