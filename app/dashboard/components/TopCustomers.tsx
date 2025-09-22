'use client';

import { useEffect, useMemo, useState } from 'react';

type TopCustomer = {
  user?: {
    id: string;
    email: string;
  } | null;
  total: number | null;
  orders: number;
};

type SortField = 'total' | 'orders' | 'email';

type Props = {
  endpoint?: string;
};

export default function TopCustomers({ endpoint = '/api/orders/top' }: Props) {
  const [customers, setCustomers] = useState<TopCustomer[]>([]);
  const [field, setField] = useState<SortField>('total');

  useEffect(() => {
    async function load() {
      const response = await fetch(endpoint);
      if (!response.ok) {
        console.error('Fehler beim Laden der Top-Besteller');
        return;
      }
      const data = (await response.json()) as TopCustomer[];
      setCustomers(data);
    }

    load().catch(console.error);
  }, [endpoint]);

  const sorted = useMemo(() => {
    return [...customers].sort((a, b) => {
      if (field === 'email') {
        return (a.user?.email ?? '').localeCompare(b.user?.email ?? '');
      }

      const valueA = field === 'total' ? Number(a.total ?? 0) : a.orders;
      const valueB = field === 'total' ? Number(b.total ?? 0) : b.orders;
      return valueB - valueA;
    });
  }, [customers, field]);

  return (
    <section className="rounded-lg bg-white p-6 shadow">
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Top-Besteller*innen</h3>
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="sort">Sortieren nach:</label>
          <select
            id="sort"
            className="rounded border border-slate-300 p-2"
            value={field}
            onChange={(event) => setField(event.target.value as SortField)}
          >
            <option value="total">Umsatz</option>
            <option value="orders">Bestellungen</option>
            <option value="email">E-Mail</option>
          </select>
        </div>
      </header>
      <table className="mt-4">
        <thead>
          <tr>
            <th>E-Mail</th>
            <th>Bestellungen</th>
            <th>Umsatz</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((customer, index) => (
            <tr key={customer.user?.id ?? `unknown-${index}`}>
              <td>{customer.user?.email ?? 'Unbekannt'}</td>
              <td>{customer.orders}</td>
              <td>{Number(customer.total ?? 0).toFixed(2)} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
