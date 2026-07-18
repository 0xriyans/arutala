import React, { useEffect } from 'react';
import { SnapScrollShop } from '../components/SnapScrollShop';

export const ShopRoute: React.FC = () => {
  // Set unique page header details on mount
  useEffect(() => {
    document.title = "The Compositions — ARUTALA";
    window.scrollTo({ top: 0 });
    
    // Disable body scroll when on this specific route so snap scroll takes over cleanly
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div id="shop-route-page">
      <SnapScrollShop />
    </div>
  );
};
