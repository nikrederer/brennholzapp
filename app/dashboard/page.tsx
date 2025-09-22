import InventoryOverview from './components/InventoryOverview';
import OrderTable from './components/OrderTable';
import TopCustomers from './components/TopCustomers';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <InventoryOverview />
      <section className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-lg font-semibold">Letzte Bestellungen</h3>
        <div className="mt-4 overflow-x-auto">
          <OrderTable />
        </div>
      </section>
      <TopCustomers />
    </div>
  );
}
