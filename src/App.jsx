import React, { useState, useEffect } from 'react';
import { Package, Truck, MapPin, Clock, User, Plus, Check, X } from 'lucide-react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import {
  collection, addDoc, updateDoc, doc, onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase.js';
import ItemPicker from './components/ItemPicker.jsx';

const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white";

const DRIVERS_KEY = 'salonSprint_drivers';

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

const formatTime = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

// ─── STYLIST VIEW ─────────────────────────────────────────────────────────────
const StylistView = ({ orders, onPlaceOrder }) => {
  const savedProfile = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');

  const [showForm, setShowForm]       = useState(false);
  const [name, setName]               = useState(savedProfile.name || '');
  const [address, setAddress]         = useState(savedProfile.address || '');
  const [time, setTime]               = useState('');
  const [pickedItems, setPickedItems] = useState([]);
  const [photoFiles, setPhotoFiles]   = useState([]);
  const [submitted, setSubmitted]     = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [validationMsg, setValidationMsg] = useState('');

  const saveProfile = (n, a) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: n, address: a }));
  };

  const handleSubmit = async () => {
    if (!name.trim())          { setValidationMsg('Please enter your name.'); return; }
    if (!address.trim())       { setValidationMsg('Please enter your delivery address.'); return; }
    if (!time)                 { setValidationMsg('Please select a preferred delivery time.'); return; }
    if (pickedItems.length === 0) { setValidationMsg('Please add at least one item.'); return; }
    setValidationMsg('');
    setSubmitting(true);
    saveProfile(name, address);

    const itemList = pickedItems.map(i => i.qty > 1 ? `${i.name} x${i.qty}` : i.name);
    await onPlaceOrder({ name, address, time: formatTime(time), items: itemList }, photoFiles);

    setSubmitted(true);
    setShowForm(false);
    setTime('');
    setPickedItems([]);
    setPhotoFiles([]);
    setSubmitting(false);
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
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Preferred delivery time</label>
              <input type="time" value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputClass} />
            </div>
          </div>

          <p className="text-sm font-semibold text-gray-700 mb-2">Items needed:</p>
          <ItemPicker
            onItemsChange={setPickedItems}
            onPhotoChange={setPhotoFiles}
          />

          {validationMsg && (
            <p className="text-red-500 text-sm mt-3 mb-1 font-medium">{validationMsg}</p>
          )}
          <div className="flex gap-3 mt-3">
            <button onClick={handleSubmit} disabled={submitting}
              className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold touch-manipulation text-white bg-indigo-600 active:bg-indigo-800 disabled:opacity-60">
              <Check size={18} />
              {submitting ? 'Sending…' : 'Submit Order'}
            </button>
            <button onClick={() => setShowForm(false)} disabled={submitting}
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
            {order.photoUrls?.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {order.photoUrls.map((url, i) => (
                  <img key={i} src={url} alt={`Photo ${i + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── OWNER / STORE VIEW ───────────────────────────────────────────────────────
const OwnerView = ({ orders, drivers, onAssignDriver, onAddDriver }) => {
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [newDriverName, setNewDriverName]   = useState('');

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

            {order.photoUrls?.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {order.photoUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer">
                    <img src={url} alt={`Photo ${i + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                  </a>
                ))}
              </div>
            )}

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

            {order.photoUrls?.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {order.photoUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer">
                    <img src={url} alt={`Photo ${i + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                  </a>
                ))}
              </div>
            )}

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

// ─── SHARED STATE (Firebase-backed) ───────────────────────────────────────────
const AppState = React.createContext(null);

const AppStateProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem(DRIVERS_KEY);
    return saved ? JSON.parse(saved) : [{ id: 1, name: 'Your Driver', available: true }];
  });

  // Real-time orders from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort newest first client-side (avoids needing a Firestore index)
      docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setOrders(docs);
    }, (err) => {
      console.error('Firestore error:', err);
    });
    return unsubscribe;
  }, []);

  // Persist drivers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(DRIVERS_KEY, JSON.stringify(drivers));
  }, [drivers]);

  const handlePlaceOrder = async (form, photoFiles = []) => {
    // Upload photos to Firebase Storage
    const photoUrls = [];
    for (const file of photoFiles) {
      try {
        const fileRef = storageRef(storage, `orders/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        photoUrls.push(url);
      } catch (err) {
        console.warn('Photo upload failed (skipped):', err);
      }
    }

    // Write order to Firestore
    await addDoc(collection(db, 'orders'), {
      stylist:   form.name,
      address:   form.address,
      items:     form.items,
      time:      form.time,
      photoUrls,
      status:    'pending',
      priority:  'same-day',
      createdAt: serverTimestamp(),
    });

    // WhatsApp notification (non-blocking)
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name, address: form.address,
        time: form.time, items: form.items,
        photoCount: photoUrls.length,
      }),
    }).catch(err => console.warn('Notification failed:', err));
  };

  const handleAssignDriver = async (orderId, driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    await updateDoc(doc(db, 'orders', orderId), {
      status: 'assigned',
      driver: driver.name,
    });
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
  };

  const handleAddDriver = (name) => {
    setDrivers(prev => [...prev, { id: prev.length + 1, name, available: true }]);
  };

  return (
    <AppState.Provider value={{ orders, drivers, handlePlaceOrder, handleAssignDriver, handleUpdateStatus, handleAddDriver }}>
      {children}
    </AppState.Provider>
  );
};

// ─── PAGE SHELL ───────────────────────────────────────────────────────────────
const PageShell = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
    <div className="max-w-lg mx-auto">
      <div className="bg-white shadow-sm px-4 pt-6 pb-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-indigo-700 flex items-center justify-center gap-2">
            <Truck size={26} className="text-indigo-600" />
            Salon Sprint
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Supplies at Speed · Same-Day Delivery</p>
        </div>
      </div>
      <div className="p-4 pb-10">{children}</div>
    </div>
  </div>
);

// ─── ROLE SELECTOR (landing page) ─────────────────────────────────────────────
const RoleSelector = () => {
  const navigate = useNavigate();
  const roles = [
    { path: '/stylist', label: "I'm a Stylist",     desc: 'Request supplies for your suite',    icon: <User    size={28} className="text-indigo-600" /> },
    { path: '/store',   label: "I'm Pro Supply",     desc: 'Manage orders & assign drivers',     icon: <Package size={28} className="text-indigo-600" /> },
    { path: '/driver',  label: "I'm a Driver",       desc: 'View and complete deliveries',       icon: <Truck   size={28} className="text-indigo-600" /> },
  ];
  return (
    <PageShell>
      <p className="text-center text-gray-500 text-sm mb-6">Select your role to continue</p>
      <div className="flex flex-col gap-4">
        {roles.map(r => (
          <button key={r.path} onClick={() => navigate(r.path)}
            className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm active:bg-indigo-50 touch-manipulation text-left w-full">
            <div className="bg-indigo-50 rounded-xl p-3 shrink-0">{r.icon}</div>
            <div>
              <p className="font-bold text-gray-800 text-base">{r.label}</p>
              <p className="text-gray-500 text-sm">{r.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </PageShell>
  );
};

// ─── ROUTED PAGES ─────────────────────────────────────────────────────────────
const StylistPage = () => {
  const { orders, handlePlaceOrder } = React.useContext(AppState);
  return <PageShell><StylistView orders={orders} onPlaceOrder={handlePlaceOrder} /></PageShell>;
};

const StorePage = () => {
  const { orders, drivers, handleAssignDriver, handleAddDriver } = React.useContext(AppState);
  return (
    <PageShell>
      <OwnerView orders={orders} drivers={drivers} onAssignDriver={handleAssignDriver} onAddDriver={handleAddDriver} />
    </PageShell>
  );
};

const DriverPage = () => {
  const { orders, handleUpdateStatus } = React.useContext(AppState);
  return <PageShell><DriverView orders={orders} onUpdateStatus={handleUpdateStatus} /></PageShell>;
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const SalonSprintApp = () => (
  <BrowserRouter>
    <AppStateProvider>
      <Routes>
        <Route path="/"       element={<RoleSelector />} />
        <Route path="/stylist" element={<StylistPage />} />
        <Route path="/store"   element={<StorePage />} />
        <Route path="/driver"  element={<DriverPage />} />
      </Routes>
    </AppStateProvider>
  </BrowserRouter>
);

export default SalonSprintApp;
