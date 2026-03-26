import React, { useState } from 'react';
import { Package, Truck, MapPin, Clock, User, Plus, Check, X } from 'lucide-react';
import ItemPicker from './components/ItemPicker.jsx';

const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white";

const StatusBadge = ({ status }) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    'in-transit': 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
  };
  const labels = {
    pending: 'Pending',
    assigned: 'Assigned',
    'in-transit': 'In Transit',
    delivered: 'Delivered',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase shrink-0 ${colors[status]}`}>
      {labels[status] || status}
    </span>
  );
};

const PROFILE_KEY = 'salonSprint_stylistProfile';

// ─── STYLIST VIEW ─────────────────────────────────────────────────────────────
const StylistView = ({ orders, onPlaceOrder }) => {
  const savedProfile = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState(savedProfile.name || '');
  const [address, setAddress] = useState(savedProfile.address || '');
  const [time, setTime] = useState('');
  const [pickedItems, setPickedItems] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const saveProfile = (n, a) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: n, address: a }));
  };

  const [validationMsg, setValidationMsg] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) { setValidationMsg('Please enter your name.'); return; }
    if (!address.trim()) { setValidationMsg('Please enter your delivery address.'); return; }
    if (!time.trim()) { setValidationMsg('Please enter a preferred delivery time.'); return; }
    if (pickedItems.length === 0) { setValidationMsg('Please add at least one item.'); return; }
    setValidationMsg('');
    saveProfile(name, address);
    onPlaceOrder({
      name,
      address,
      time,
      items: pickedItems.map(i => i.qty > 1 ? `${i.name} x${i.qty}` : i.name),
      photo,
    });
    setSubmitted(true);
    setShowForm(false);
    setTime('');
    setPickedItems([]); setPhoto(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">My Orders</h2>
      <p className="text-sm text-gray-500 mb-5">Request supplies and track your deliveries</p>

      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 text-center">
          <p className="text-green-700 font-semibold text-base">Order received!</p>
          <p className="text-green-600 text-sm mt-1">We'll confirm your delivery shortly.</p>
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => { setShowForm(true); setSubmitted(false); }}
          className="w-full bg-indigo-600 active:bg-indigo-800 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-base touch-manipulation mb-5"
        >
          <Plus size={20} />
          Request New Delivery
        </button>
      )}

      {showForm && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-5">
          <h3 className="text-base font-bold text-indigo-700 mb-4">New Delivery Request</h3>
          <div className="flex flex-col gap-3 mb-4">
            <div>
              <input type="text" placeholder="Your name" value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass} />
              {savedProfile.name && (
                <p className="text-xs text-indigo-500 mt-1 ml-1">Remembered from last order</p>
              )}
            </div>
            <div>
              <input type="text" placeholder="Delivery address" value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputClass} />
              {savedProfile.address && (
                <p className="text-xs text-indigo-500 mt-1 ml-1">Remembered from last order</p>
              )}
            </div>
            <input type="text" placeholder="Preferred time (e.g. 3:00 PM)" value={time}
              onChange={(e) => setTime(e.target.value)}
              className={inputClass} />
          </div>

          <p className="text-sm font-semibold text-gray-700 mb-2">Items needed:</p>
          <ItemPicker
            onItemsChange={setPickedItems}
            onPhotoChange={setPhoto}
          />

          {validationMsg && (
            <p className="text-red-500 text-sm mt-3 mb-1 font-medium">{validationMsg}</p>
          )}
          <div className="flex gap-3 mt-3">
            <button onClick={handleSubmit}
              className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold touch-manipulation text-white bg-indigo-600 active:bg-indigo-800">
              <Check size={18} />
              Submit Order
            </button>
            <button onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-200 active:bg-gray-400 text-gray-700 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold touch-manipulation">
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {orders.length === 0 && !submitted && (
          <p className="text-center text-gray-400 text-sm py-8">No orders yet. Request a delivery above.</p>
        )}
        {orders.map(order => (
          <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start gap-2 mb-2">
              <p className="font-semibold text-gray-800 text-sm">{order.items.join(', ')}</p>
              <StatusBadge status={order.status} />
            </div>
            <div className="space-y-1 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-indigo-400 shrink-0" />
                <span>{order.time}</span>
              </div>
              {order.driver && (
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-indigo-400 shrink-0" />
                  <span>Driver: {order.driver}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── OWNER VIEW ───────────────────────────────────────────────────────────────
const OwnerView = ({ orders, drivers, onAssignDriver, onAddDriver }) => {
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [newDriverName, setNewDriverName] = useState('');

  const handleAddDriver = () => {
    if (newDriverName.trim()) {
      onAddDriver(newDriverName.trim());
      setNewDriverName('');
      setShowDriverForm(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Delivery Dashboard</h2>
      <p className="text-sm text-gray-500 mb-5">Manage incoming orders and assign drivers</p>

      {/* Driver Management */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-semibold text-gray-700">Drivers ({drivers.filter(d => d.available).length} available)</p>
          <button
            onClick={() => setShowDriverForm(!showDriverForm)}
            className="text-indigo-600 text-sm font-semibold touch-manipulation flex items-center gap-1"
          >
            <Plus size={15} /> Add Driver
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {drivers.map(d => (
            <span key={d.id} className={`text-xs px-2.5 py-1 rounded-full font-medium ${d.available ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
              {d.name}
            </span>
          ))}
        </div>
        {showDriverForm && (
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              placeholder="Driver name"
              value={newDriverName}
              onChange={(e) => setNewDriverName(e.target.value)}
              className={inputClass}
            />
            <button onClick={handleAddDriver}
              className="bg-indigo-600 text-white px-4 rounded-xl font-semibold touch-manipulation shrink-0">
              Add
            </button>
          </div>
        )}
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {orders.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">No orders yet. Waiting for stylists to request deliveries.</p>
        )}
        {orders.map(order => (
          <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start gap-2 mb-3">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-gray-800 truncate">{order.stylist}</h3>
                <p className="text-gray-500 text-xs truncate">{order.salon || 'Independent Stylist'}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="space-y-1.5 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                <span>{order.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Package size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                <span>{order.items.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-indigo-400 shrink-0" />
                <span>{order.time}</span>
              </div>
              {order.driver && (
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-indigo-400 shrink-0" />
                  <span>Driver: {order.driver}</span>
                </div>
              )}
            </div>

            {order.status === 'pending' && (
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Assign Driver:</label>
                <select
                  onChange={(e) => onAssignDriver(order.id, parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  defaultValue=""
                >
                  <option value="" disabled>Select a driver...</option>
                  {drivers.filter(d => d.available).map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name}
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
};

// ─── DRIVER VIEW ──────────────────────────────────────────────────────────────
const DriverView = ({ orders, onUpdateStatus }) => {
  const assignedOrders = orders.filter(o => o.status === 'assigned' || o.status === 'in-transit');

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">My Deliveries</h2>
      <p className="text-sm text-gray-500 mb-5">Your active and upcoming deliveries</p>

      <div className="space-y-4">
        {assignedOrders.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">No deliveries assigned yet.</p>
        )}
        {assignedOrders.map(order => (
          <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start gap-2 mb-3">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-gray-800 truncate">{order.stylist}</h3>
                <p className="text-gray-500 text-xs">{order.salon || 'Independent Stylist'}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="space-y-1.5 text-sm text-gray-600 mb-4">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                <span>{order.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Package size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                <span>{order.items.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-indigo-400 shrink-0" />
                <span>Expected: {order.time}</span>
              </div>
            </div>

            {order.status === 'assigned' && (
              <button
                onClick={() => onUpdateStatus(order.id, 'in-transit')}
                className="w-full bg-purple-600 active:bg-purple-800 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold touch-manipulation"
              >
                <Truck size={18} />
                Start Delivery
              </button>
            )}
            {order.status === 'in-transit' && (
              <button
                onClick={() => onUpdateStatus(order.id, 'delivered')}
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

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const SalonSprintApp = () => {
  const [userType, setUserType] = useState('stylist');
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Alex Johnson', available: true },
    { id: 2, name: 'Sarah Williams', available: true },
  ]);

  const handlePlaceOrder = (form) => {
    const order = {
      id: orders.length + 1,
      stylist: form.name,
      salon: '',
      address: form.address,
      items: form.items,
      status: 'pending',
      priority: 'same-day',
      time: form.time,
    };
    setOrders(prev => [...prev, order]);
  };

  const handleAssignDriver = (orderId, driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: 'assigned', driver: driver.name } : o
    ));
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
  };

  const handleAddDriver = (name) => {
    setDrivers(prev => [...prev, { id: prev.length + 1, name, available: true }]);
  };

  const tabs = [
    { key: 'stylist', label: 'Stylist' },
    { key: 'owner', label: 'Supply Owner' },
    { key: 'driver', label: 'Driver' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="bg-white shadow-sm px-4 pt-6 pb-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-indigo-700 flex items-center justify-center gap-2">
              <Truck size={26} className="text-indigo-600" />
              Salon Sprint
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Supplies at Speed · Same-Day Delivery</p>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex bg-gray-100 px-2 py-2 gap-1.5 sticky top-0 z-10 shadow-sm">
          {tabs.map(tab => (
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
          {userType === 'stylist' && (
            <StylistView orders={orders} onPlaceOrder={handlePlaceOrder} />
          )}
          {userType === 'owner' && (
            <OwnerView
              orders={orders}
              drivers={drivers}
              onAssignDriver={handleAssignDriver}
              onAddDriver={handleAddDriver}
            />
          )}
          {userType === 'driver' && (
            <DriverView orders={orders} onUpdateStatus={handleUpdateStatus} />
          )}
        </div>

      </div>
    </div>
  );
};

export default SalonSprintApp;
