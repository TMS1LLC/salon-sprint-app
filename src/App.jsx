import React, { useState } from 'react';
import { Package, Truck, MapPin, Clock, User, Plus, Check, X } from 'lucide-react';

const SalonSprintApp = () => {
  const [userType, setUserType] = useState('owner');
  const [orders, setOrders] = useState([
    {
      id: 1,
      stylist: 'Maria Garcia',
      salon: 'Glamour Studio',
      address: '123 Main St, Los Angeles',
      items: ['Shampoo x3', 'Hair Color Kit', 'Scissors'],
      status: 'pending',
      priority: 'same-day',
      time: '2:30 PM'
    },
    {
      id: 2,
      stylist: 'John Smith',
      salon: 'Style Haven',
      address: '456 Oak Ave, Los Angeles',
      items: ['Conditioner x5', 'Styling Gel'],
      status: 'assigned',
      driver: 'Alex Johnson',
      priority: 'same-day',
      time: '3:00 PM'
    },
    {
      id: 3,
      stylist: 'Sophie Chen',
      salon: 'Chic Cuts',
      address: '789 Pine Rd, Los Angeles',
      items: ['Hair Dryer', 'Brushes x4'],
      status: 'in-transit',
      driver: 'Sarah Williams',
      priority: 'same-day',
      time: '1:45 PM'
    }
  ]);

  const [drivers] = useState([
    { id: 1, name: 'Alex Johnson', available: true, deliveries: 3 },
    { id: 2, name: 'Sarah Williams', available: false, deliveries: 1 },
    { id: 3, name: 'Mike Brown', available: true, deliveries: 5 }
  ]);

  const [showNewOrder, setShowNewOrder] = useState(false);
  const [newOrder, setNewOrder] = useState({
    stylist: '',
    salon: '',
    address: '',
    items: '',
    time: ''
  });

  const assignDriver = (orderId, driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    setOrders(orders.map(o =>
      o.id === orderId ? { ...o, status: 'assigned', driver: driver.name } : o
    ));
  };

  const updateStatus = (orderId, newStatus) => {
    setOrders(orders.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
  };

  const createOrder = () => {
    if (newOrder.stylist && newOrder.salon && newOrder.address && newOrder.items && newOrder.time) {
      const order = {
        id: orders.length + 1,
        stylist: newOrder.stylist,
        salon: newOrder.salon,
        address: newOrder.address,
        items: newOrder.items.split(',').map(item => item.trim()),
        status: 'pending',
        priority: 'same-day',
        time: newOrder.time
      };
      setOrders([...orders, order]);
      setNewOrder({ stylist: '', salon: '', address: '', items: '', time: '' });
      setShowNewOrder(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500";

  const StatusBadge = ({ status }) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      'in-transit': 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase shrink-0 ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const OwnerView = () => (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-800">Delivery Dashboard</h2>
        <button
          onClick={() => setShowNewOrder(true)}
          className="bg-indigo-600 active:bg-indigo-800 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold touch-manipulation"
        >
          <Plus size={18} />
          New Order
        </button>
      </div>

      {showNewOrder && (
        <div className="bg-indigo-50 p-4 rounded-xl mb-5 border border-indigo-200">
          <h3 className="text-lg font-bold mb-4 text-indigo-700">Create New Delivery Order</h3>
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Stylist Name" value={newOrder.stylist}
              onChange={(e) => setNewOrder({ ...newOrder, stylist: e.target.value })}
              className={inputClass} />
            <input type="text" placeholder="Salon Name" value={newOrder.salon}
              onChange={(e) => setNewOrder({ ...newOrder, salon: e.target.value })}
              className={inputClass} />
            <input type="text" placeholder="Delivery Address" value={newOrder.address}
              onChange={(e) => setNewOrder({ ...newOrder, address: e.target.value })}
              className={inputClass} />
            <input type="text" placeholder="Items (comma separated)" value={newOrder.items}
              onChange={(e) => setNewOrder({ ...newOrder, items: e.target.value })}
              className={inputClass} />
            <input type="text" placeholder="Delivery Time (e.g., 3:00 PM)" value={newOrder.time}
              onChange={(e) => setNewOrder({ ...newOrder, time: e.target.value })}
              className={inputClass} />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={createOrder}
              className="flex-1 bg-green-600 active:bg-green-800 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold touch-manipulation">
              <Check size={18} />
              Create Order
            </button>
            <button onClick={() => setShowNewOrder(false)}
              className="flex-1 bg-gray-400 active:bg-gray-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold touch-manipulation">
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-3 gap-2">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-gray-800 truncate">{order.stylist}</h3>
                <p className="text-gray-500 text-sm truncate">{order.salon}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-indigo-600 mt-0.5 shrink-0" />
                <span>{order.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Package size={15} className="text-indigo-600 mt-0.5 shrink-0" />
                <span>{order.items.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-indigo-600 shrink-0" />
                <span>{order.time}</span>
              </div>
              {order.driver && (
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-indigo-600 shrink-0" />
                  <span>Driver: {order.driver}</span>
                </div>
              )}
            </div>

            {order.status === 'pending' && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assign Driver:</label>
                <select
                  onChange={(e) => assignDriver(order.id, parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  defaultValue=""
                >
                  <option value="" disabled>Select a driver...</option>
                  {drivers.filter(d => d.available).map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} ({driver.deliveries} deliveries today)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const DriverView = () => {
    const driverOrders = orders.filter(o => o.driver === 'Alex Johnson');

    return (
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-5">My Deliveries</h2>
        <div className="space-y-4">
          {driverOrders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-3 gap-2">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-gray-800 truncate">{order.stylist}</h3>
                  <p className="text-gray-500 text-sm truncate">{order.salon}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin size={15} className="text-indigo-600 mt-0.5 shrink-0" />
                  <span>{order.address}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Package size={15} className="text-indigo-600 mt-0.5 shrink-0" />
                  <span>{order.items.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-indigo-600 shrink-0" />
                  <span>Expected: {order.time}</span>
                </div>
              </div>

              {order.status === 'assigned' && (
                <button
                  onClick={() => updateStatus(order.id, 'in-transit')}
                  className="w-full bg-purple-600 active:bg-purple-800 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold touch-manipulation"
                >
                  <Truck size={18} />
                  Start Delivery
                </button>
              )}
              {order.status === 'in-transit' && (
                <button
                  onClick={() => updateStatus(order.id, 'delivered')}
                  className="w-full bg-green-600 active:bg-green-800 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold touch-manipulation"
                >
                  <Check size={18} />
                  Mark Delivered
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const StylistView = () => {
    const stylistOrders = orders.filter(o => o.stylist === 'Maria Garcia');

    return (
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-5">My Orders</h2>
        <div className="space-y-4">
          {stylistOrders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-3 gap-2">
                <h3 className="text-base font-bold text-gray-800 truncate">{order.salon}</h3>
                <StatusBadge status={order.status} />
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <Package size={15} className="text-indigo-600 mt-0.5 shrink-0" />
                  <span>{order.items.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-indigo-600 shrink-0" />
                  <span>Expected: {order.time}</span>
                </div>
                {order.driver && (
                  <div className="flex items-center gap-2">
                    <User size={15} className="text-indigo-600 shrink-0" />
                    <span>Driver: {order.driver}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <button className="w-full bg-indigo-600 active:bg-indigo-800 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-base touch-manipulation">
            <Plus size={20} />
            Request New Delivery
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="bg-white shadow-sm px-4 pt-6 pb-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-indigo-700 flex items-center justify-center gap-2">
              <Truck size={28} className="text-indigo-600" />
              Salon Sprint
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Supplies at Speed · Same-Day Delivery</p>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex bg-gray-100 px-2 py-2 gap-1.5 sticky top-0 z-10 shadow-sm">
          {[
            { key: 'owner', label: 'Supply Owner' },
            { key: 'driver', label: 'Driver' },
            { key: 'stylist', label: 'Stylist' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setUserType(tab.key)}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition touch-manipulation ${
                userType === tab.key
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 pb-10">
          {userType === 'owner' && <OwnerView />}
          {userType === 'driver' && <DriverView />}
          {userType === 'stylist' && <StylistView />}
        </div>

      </div>
    </div>
  );
};

export default SalonSprintApp;
