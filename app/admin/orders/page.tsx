"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const ALLOWED_STATUSES = [
  'Pending Approval',
  'Approved',
  'Out for Delivery',
  'Delivered',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

    async function fetchOrders() {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    }

  async function updateStatus(orderId: string, status: string) {
    setUpdating(true);
    const res = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status }),
    });
    if (res.ok) {
      await fetchOrders();
    } else {
      alert('Failed to update status');
    }
    setUpdating(false);
  }

  async function deleteOrder(orderId: string) {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    setUpdating(true);
    const res = await fetch('/api/orders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId }),
    });
    if (res.ok) {
      await fetchOrders();
      setSelectedOrder(null);
    } else {
      alert('Failed to delete order');
    }
    setUpdating(false);
  }

  async function updateItemStatus(orderId: string, itemIndex: number, itemStatus: string) {
    setUpdating(true);
    const res = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, itemIndex, itemStatus }),
    });
    if (res.ok) {
      await fetchOrders();
      // Optionally update selectedOrder
      const updated = await res.json();
      setSelectedOrder(updated);
    } else {
      alert('Failed to update item status');
    }
    setUpdating(false);
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-2 font-mono text-xs">#{order.id.slice(-6)}</td>
                      <td className="px-4 py-2">{order.shippingName}</td>
                      <td className="px-4 py-2">{order.shippingEmail}</td>
                      <td className="px-4 py-2">{order.shippingAddress}, {order.shippingCity}, {order.shippingPostalCode}</td>
                      <td className="px-4 py-2">{order.items.length}</td>
                      <td className="px-4 py-2 font-semibold">Rs. {order.total.toFixed(0)}</td>
                      <td className="px-4 py-2">
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          disabled={updating}
                          className="border rounded px-2 py-1"
                        >
                          {ALLOWED_STATUSES.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteOrder(order.id)} disabled={updating} className="ml-2">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setSelectedOrder(null)}>&times;</button>
            <h2 className="text-xl font-bold mb-2">Order #{selectedOrder.id.slice(-6)}</h2>
            <div className="mb-2"><b>Name:</b> {selectedOrder.shippingName}</div>
            <div className="mb-2"><b>Email:</b> {selectedOrder.shippingEmail}</div>
            <div className="mb-2"><b>Phone:</b> {selectedOrder.shippingPhone}</div>
            <div className="mb-2"><b>Address:</b> {selectedOrder.shippingAddress}, {selectedOrder.shippingCity}, {selectedOrder.shippingPostalCode}</div>
            <div className="mb-2"><b>Status:</b> {selectedOrder.status}</div>
            <div className="mb-2"><b>Date:</b> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
            <div className="mb-2"><b>Products:</b></div>
            <ul className="mb-2 pl-4 list-disc">
              {selectedOrder.items.map((item: any, idx: number) => (
                <li key={idx} className="flex items-center gap-2">
                  {item.title} x {item.quantity} @ Rs. {item.price}
                  {item.discount ? (
                    <span className="ml-2 text-xs text-red-500">{item.discount}% OFF</span>
                  ) : null}
                  <select
                    value={item.status}
                    onChange={e => updateItemStatus(selectedOrder.id, idx, e.target.value)}
                    disabled={updating}
                    className="border rounded px-2 py-1 ml-2"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </li>
              ))}
            </ul>
            <div className="mt-2 font-bold">Total: Rs. {selectedOrder.total.toFixed(0)}</div>
            <Button variant="destructive" className="mt-4" onClick={() => deleteOrder(selectedOrder.id)} disabled={updating}>Delete Order</Button>
          </div>
        </div>
      )}
    </div>
  );
} 