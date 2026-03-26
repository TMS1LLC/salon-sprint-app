import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Plus, Minus, Star, Camera, Image } from 'lucide-react';
import products from '../data/products.js';

const STORAGE_KEY = 'salonSprint_usualItems';

const ItemPicker = ({ onItemsChange, onPhotoChange }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [items, setItems] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [justSaved, setJustSaved] = useState(false);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  // Load saved items on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setSavedItems(JSON.parse(stored));
  }, []);

  // Helper: update items and notify parent in one step
  const updateItems = (newItems) => {
    setItems(newItems);
    onItemsChange(newItems);
  };

  // Autocomplete filtering
  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    const q = query.toLowerCase();
    const results = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 8);
    setSuggestions(results);
  }, [query]);

  const addProduct = (product) => {
    const exists = items.find(i => i.id === product.id);
    const newItems = exists
      ? items.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      : [...items, { ...product, qty: 1 }];
    updateItems(newItems);
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const addCustomItem = () => {
    if (!query.trim()) return;
    const custom = {
      id: `custom_${Date.now()}`,
      brand: 'Other',
      name: query.trim(),
      category: 'Custom',
      qty: 1,
    };
    updateItems([...items, custom]);
    setQuery('');
    setSuggestions([]);
  };

  const updateQty = (id, delta) => {
    const newItems = items.map(i =>
      i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    );
    updateItems(newItems);
  };

  const removeItem = (id) => {
    updateItems(items.filter(i => i.id !== id));
  };

  const saveAsUsual = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    setSavedItems(items);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const loadUsual = () => {
    updateItems(savedItems);
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      onPhotoChange(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-3">

      {/* Saved Items Banner */}
      {savedItems.length > 0 && (
        <button type="button" onClick={loadUsual}
          className="w-full flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 touch-manipulation">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-amber-500 fill-amber-400" />
            <span className="text-sm font-semibold text-amber-800">Load My Usual Items</span>
          </div>
          <span className="text-xs text-amber-600">{savedItems.length} items</span>
        </button>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 bg-white focus-within:ring-2 focus-within:ring-indigo-500">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products (e.g. Goldwell, shampoo...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomItem(); } }}
            className="flex-1 py-3 text-base bg-transparent outline-none"
            autoComplete="off"
          />
          {query.length > 0 && (
            <button type="button" onClick={() => { setQuery(''); setSuggestions([]); }}>
              <X size={16} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {suggestions.map(p => (
              <button key={p.id} type="button" onClick={() => addProduct(p)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-indigo-50 active:bg-indigo-100 border-b border-gray-100 last:border-0 touch-manipulation">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.brand} · {p.category}</p>
                </div>
                <Plus size={16} className="text-indigo-400 shrink-0" />
              </button>
            ))}
            <button type="button" onClick={addCustomItem}
              className="w-full flex items-center gap-2 px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 touch-manipulation">
              <Plus size={15} className="text-gray-500" />
              <span className="text-sm text-gray-600">Add "<strong>{query}</strong>" as custom item</span>
            </button>
          </div>
        )}

        {/* Custom item when no catalog matches */}
        {query.trim().length >= 2 && suggestions.length === 0 && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <button type="button" onClick={addCustomItem}
              className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 touch-manipulation">
              <Plus size={15} className="text-gray-500" />
              <span className="text-sm text-gray-600">Add "<strong>{query}</strong>" as custom item</span>
            </button>
          </div>
        )}
      </div>

      {/* Selected Items List */}
      {items.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {items.map((item, idx) => (
            <div key={item.id}
              className={`flex items-center gap-3 px-4 py-3 ${idx < items.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                <p className="text-xs text-gray-400">{item.brand}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={() => updateQty(item.id, -1)}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 touch-manipulation">
                  <Minus size={13} />
                </button>
                <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                <button type="button" onClick={() => updateQty(item.id, 1)}
                  className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center active:bg-indigo-200 touch-manipulation">
                  <Plus size={13} className="text-indigo-600" />
                </button>
                <button type="button" onClick={() => removeItem(item.id)}
                  className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center active:bg-red-100 touch-manipulation ml-1">
                  <X size={13} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <button type="button" onClick={saveAsUsual}
              className="flex items-center gap-1.5 text-sm text-amber-600 font-semibold touch-manipulation">
              <Star size={14} className={justSaved ? 'fill-amber-400 text-amber-400' : ''} />
              {justSaved ? 'Saved!' : 'Save as My Usual Items'}
            </button>
          </div>
        </div>
      )}

      {/* Photo Attach */}
      <div className="flex gap-2">
        <button type="button" onClick={() => cameraRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3 text-sm text-gray-600 font-medium bg-white active:bg-gray-50 touch-manipulation">
          <Camera size={16} className="text-indigo-400" />
          Take Photo
        </button>
        <input ref={cameraRef} type="file" accept="image/*" capture="environment"
          className="hidden" onChange={handlePhoto} />

        <button type="button" onClick={() => fileRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3 text-sm text-gray-600 font-medium bg-white active:bg-gray-50 touch-manipulation">
          <Image size={16} className="text-indigo-400" />
          Choose Photo
        </button>
        <input ref={fileRef} type="file" accept="image/*"
          className="hidden" onChange={handlePhoto} />
      </div>

      {/* Photo Preview */}
      {photo && (
        <div className="relative rounded-xl overflow-hidden border border-gray-200">
          <img src={photo} alt="Order reference" className="w-full max-h-48 object-cover" />
          <button type="button"
            onClick={() => { setPhoto(null); onPhotoChange(null); }}
            className="absolute top-2 right-2 bg-black/60 rounded-full p-1 touch-manipulation">
            <X size={14} className="text-white" />
          </button>
          <p className="text-xs text-gray-500 px-3 py-2 bg-gray-50">
            Photo attached — founder will see this with your order
          </p>
        </div>
      )}

    </div>
  );
};

export default ItemPicker;
