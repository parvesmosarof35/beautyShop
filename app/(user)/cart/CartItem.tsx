'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import type { CartItem as CartItemType } from '../../context/CartContext';

interface CartItemProps {
  item: CartItemType & {
    color?: string;
    size?: string;
  };
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const debouncedQuantityRef = useRef(item.quantity);
  
  // Sync local state with prop when prop changes (e.g. from refresh or other sources)
  // But only if the local state isn't currently "ahead" or being edited recently? 
  // For simplicity, we sync when item.quantity changes, but we need to avoid jumping if user is clicking fast.
  // Actually, if we rely on local state, we should only sync if the prop is different and we haven't touched it recently?
  // A common pattern: sync only if the incoming prop is structurally different from what we expect, 
  // or just trust local state while "active".
  // Let's use a simple effect that updates local if remote changes, but we might overwrite typing?
  // Since we have buttons, it's safer.
  
  useEffect(() => {
     if (item.quantity !== debouncedQuantityRef.current) {
        setLocalQuantity(item.quantity);
        debouncedQuantityRef.current = item.quantity;
     }
  }, [item.quantity]);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
        if (localQuantity !== item.quantity) {
            onUpdateQuantity(item.id, localQuantity);
            debouncedQuantityRef.current = localQuantity;
        }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [localQuantity, item.id, item.quantity, onUpdateQuantity]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setLocalQuantity(newQuantity);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center py-6 border-b border-gray-700">
      <div className="w-full md:w-1/3 flex items-start">
        <div className="w-24 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-4">
          <h3 className="text-gray-100 font-medium">{item.name}</h3>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-400">Color: {item.color}</span>
            <span className="mx-2 text-gray-600">|</span>
            <span className="text-sm text-gray-400">Size: {item.size}</span>
          </div>
          <button 
            onClick={() => onRemove(item.id)}
            className="mt-2 text-red-400 hover:text-red-300 text-sm flex items-center"
          >
            <FiTrash2 className="mr-1" /> Remove
          </button>
        </div>
      </div>
      
      <div className="w-full md:w-1/4 mt-4 md:mt-0">
        <span className="text-gray-300">${item.price.toFixed(2)}</span>
        {item.originalPrice !== undefined && item.originalPrice > item.price && (
          <span className="line-through text-gray-500 text-sm ml-2">
            ${item.originalPrice.toFixed(2)}
          </span>
        )}
      </div>
      
      <div className="w-full md:w-1/4 mt-4 md:mt-0">
        <div className="flex items-center border border-gray-600 rounded-md w-28">
          <button 
            onClick={() => handleQuantityChange(localQuantity - 1)}
            className="px-3 py-1 text-gray-300 hover:bg-gray-700 rounded-l"
          >
            <FiMinus size={16} />
          </button>
          <span className="flex-1 text-center text-gray-100">{localQuantity}</span>
          <button 
            onClick={() => handleQuantityChange(localQuantity + 1)}
            className="px-3 py-1 text-gray-300 hover:bg-gray-700 rounded-r"
          >
            <FiPlus size={16} />
          </button>
        </div>
      </div>
      
      <div className="w-full md:w-1/6 mt-4 md:mt-0 text-right">
        <span className="text-gray-100 font-medium">
          ${(item.price * localQuantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
