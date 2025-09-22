import { getInventoryOverview } from '../../lib/db/inventory';

export default async function InventoryOverview() {
  const inventory = await getInventoryOverview();

  return (
    <section className="rounded-lg bg-white p-6 shadow">
      <h3 className="text-lg font-semibold">Lagerstände</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {inventory.map((entry) => (
          <article key={entry.id} className="rounded border border-slate-200 p-4">
            <h4 className="text-base font-medium">{entry.item.name}</h4>
            <p className="text-sm text-slate-600">
              Verfügbar: <strong>{entry.quantity}</strong> Stück
            </p>
            <p className="text-sm text-slate-600">
              Einzelpreis: {Number(entry.item.unitPrice).toFixed(2)} €
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
