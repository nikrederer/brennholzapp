import { getOrderHistory } from '../../lib/db/orders';

export default async function OrderTable({ userId }: { userId?: string }) {
  const orders = await getOrderHistory(userId);

  if (orders.length === 0) {
    return <p>Es liegen noch keine Bestellungen vor.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Bestellnummer</th>
          <th>Kund*in</th>
          <th>Positionen</th>
          <th>Gesamtpreis</th>
          <th>Datum</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td className="font-mono text-sm">{order.id.slice(0, 8)}</td>
            <td>{order.user.email}</td>
            <td>
              <ul className="m-0 list-disc space-y-1 pl-4">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.item.name} × {item.quantity} @ {Number(item.unitPrice).toFixed(2)} €
                  </li>
                ))}
              </ul>
            </td>
            <td>{Number(order.total).toFixed(2)} €</td>
            <td>{order.createdAt.toLocaleDateString('de-DE')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
