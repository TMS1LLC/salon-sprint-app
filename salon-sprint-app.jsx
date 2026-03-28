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

  const StatusBadge = ({ status }) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      'in-transit': 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const OwnerView = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Delivery Dashboard</h2>
        <button
          onClick={() => setShowNewOrder(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={20} />
          New Order
        </button>
      </div>

      {showNewOrder && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-2 border-indigo-200">
          <h3 className="text-xl font-bold mb-4 text-indigo-700">Create New Delivery Order</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Stylist Name"
              value={newOrder.stylist}
              onChange={(e) => setNewOrder({ ...newOrder, stylist: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Salon Name"
              value={newOrder.salon}
              onChange={(e) => setNewOrder({ ...newOrder, salon: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Delivery Address"
              value={newOrder.address}
              onChange={(e) => setNewOrder({ ...newOrder, address: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Items (comma separated)"
              value={newOrder.items}
              onChange={(e) => setNewOrder({ ...newOrder, items: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Delivery Time (e.g., 3:00 PM)"
              value={newOrder.time}
              onChange={(e) => setNewOrder({ ...newOrder, time: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={createOrder}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Check size={20} />
              Create Order
            </button>
            <button
              onClick={() => setShowNewOrder(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <X size={20} />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{order.stylist}</h3>
                <p className="text-gray-600 text-sm">{order.salon}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={16} className="text-indigo-600" />
                {order.address}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Package size={16} className="text-indigo-600" />
                {order.items.join(', ')}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock size={16} className="text-indigo-600" />
                {order.time}
              </div>
              {order.driver && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Truck size={16} className="text-indigo-600" />
                  Driver: {order.driver}
                </div>
              )}
            </div>

            {order.status === 'pending' && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assign Driver:</label>
                <select
                  onChange={(e) => assignDriver(order.id, parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Deliveries</h2>
        <div className="space-y-4">
          {driverOrders.map(order => (
            <div key={order.id} className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{order.stylist}</h3>
                  <p className="text-gray-600 text-sm">{order.salon}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={16} className="text-indigo-600" />
                  {order.address}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Package size={16} className="text-indigo-600" />
                  {order.items.join(', ')}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock size={16} className="text-indigo-600" />
                  Expected: {order.time}
                </div>
              </div>

              <div className="flex gap-3">
                {order.status === 'assigned' && (
                  <button
                    onClick={() => updateStatus(order.id, 'in-transit')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                  >
                    <Truck size={18} />
                    Start Delivery
                  </button>
                )}
                {order.status === 'in-transit' && (
                  <button
                    onClick={() => updateStatus(order.id, 'delivered')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                  >
                    <Check size={18} />
                    Mark Delivered
                  </button>
                )}
              </div>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
        <div className="space-y-4">
          {stylistOrders.map(order => (
            <div key={order.id} className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800">{order.salon}</h3>
                <StatusBadge status={order.status} />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Package size={16} className="text-indigo-600" />
                  {order.items.join(', ')}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock size={16} className="text-indigo-600" />
                  Expected: {order.time}
                </div>
                {order.driver && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <User size={16} className="text-indigo-600" />
                    Driver: {order.driver}
                  </div>
                )}
              </div>
            </div>
          ))}
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition">
            <Plus size={20} />
            Request New Delivery
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4 pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-t-lg shadow-lg p-6 mb-0">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-indigo-700 mb-2 flex items-center justify-center gap-3">
              <Truck size={40} className="text-indigo-600" />
              Salon Sprint
            </h1>
            <p className="text-gray-600 text-lg">Supplies at Speed</p>
            <p className="text-gray-500 text-sm mt-1">Same-Day Salon Supply Delivery</p>
          </div>
        </div>

        <div className="flex gap-2 bg-gray-100 p-2 rounded-none">
          <button
            onClick={() => setUserType('owner')}
            className={`flex-1 py-3 px-4 rounded-lg transition font-semibold ${
              userType === 'owner' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Supply Owner
          </button>
          <button
            onClick={() => setUserType('driver')}
            className={`flex-1 py-3 px-4 rounded-lg transition font-semibold ${
              userType === 'driver' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Driver
          </button>
          <button
            onClick={() => setUserType('stylist')}
            className={`flex-1 py-3 px-4 rounded-lg transition font-semibold ${
              userType === 'stylist' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Stylist
          </button>
        </div>

        <div className="bg-white rounded-b-lg shadow-lg p-6">
          {userType === 'owner' && <OwnerView />}
          {userType === 'driver' && <DriverView />}
          {userType === 'stylist' && <StylistView />}
        </div>

        <div className="mt-6 text-center text-gray-600 text-sm bg-white/80 rounded-lg p-4 shadow">
          <p className="font-semibold text-indigo-700 mb-1">🚀 Salon Sprint MVP Prototype</p>
          <p>Connecting salon supply owners, drivers, and stylists for same-day delivery</p>
        </div>
      </div>
    </div>
  );
};

export default SalonSprintApp;
