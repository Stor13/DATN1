import React from "react";
import { useEffect, useState } from "react";
import { ActionDelete } from "../../components/Action";
import { Table } from "../../components/Table";
import { LabelStatus } from "../../components/label";
import { useAccount } from "wagmi";
import ActionAccept from "../../components/Action/ActionAccept";
import { getPendingOrders } from "../../service/blockchain";
import { toast } from "react-toastify";
import { ethers } from "ethers";

const OrderTable = () => {
  const { address } = useAccount();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const pendingOrders = await getPendingOrders();
        console.log(pendingOrders[0]); // Check raw data structure
        const formattedOrders = pendingOrders.map((order) => ({
          orderId: Number(order.orderId),
          customer: order.customer,
          foodNames: Array.from(order.foodNames), // Convert to regular array
          quantities: Array.from(order.quantities).map(Number), // Convert to number array
          totalAmount: ethers.formatEther(order.totalAmount),
          timestamp: new Date(Number(order.timestamp) * 1000).toLocaleString(),
          status: Number(order.status),
        }));
        setOrders(formattedOrders);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to load orders");
      }
    };
    fetchOrders();
  }, []);

  const renderUserItem = (order) => (
    <tr key={order.orderId}>
      <td>{order.orderId}</td>
      <td>{order.timestamp}</td>
      <td>{order.customer.slice(0, 5)}...</td>
      <td className="whitespace-nowrap">
        <div className="flex flex-col gap-2 text-sm">
          {order.foodNames.map((name, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                {name} / {order.quantities[index]}
              </div>
            </div>
          ))}
        </div>
      </td>
      <td>{order.totalAmount} ETH</td>
      <td>
        <LabelStatus type="warning">PENDING</LabelStatus>
      </td>
      <td>
        <div className="flex gap-5 text-gray-400">
          <ActionAccept />
          <ActionDelete />
        </div>
      </td>
    </tr>
  );

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>OrderId</th>
            <th>Timestamp</th>
            <th>Customer</th>
            <th>Food / Quantity</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{orders.map(renderUserItem)}</tbody>
      </Table>
    </div>
  );
};

export default OrderTable;
