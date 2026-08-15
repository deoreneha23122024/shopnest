import { describe, it, expect } from 'vitest';
import wishlistReducer, {
  addToWishlist,
  removeFromWishlist,
} from '../store/wishlistSlice';

const sampleProduct = {
  id: 2,
  title: 'Test Jewel',
  price: 49.99,
  image: 'jewel.jpg',
  category: 'jewelery',
  rating: { rate: 4.5, count: 120 },
};

describe('wishlistSlice', () => {
  it('should return initial state', () => {
    expect(wishlistReducer(undefined, {})).toEqual({ items: [] });
  });

  it('should add a product to wishlist', () => {
    const state = wishlistReducer(undefined, addToWishlist(sampleProduct));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(2);
  });

  it('should not add duplicate product to wishlist', () => {
    let state = wishlistReducer(undefined, addToWishlist(sampleProduct));
    state = wishlistReducer(state, addToWishlist(sampleProduct));
    expect(state.items).toHaveLength(1);
  });

  it('should remove a product from wishlist', () => {
    let state = wishlistReducer(undefined, addToWishlist(sampleProduct));
    state = wishlistReducer(state, removeFromWishlist(2));
    expect(state.items).toHaveLength(0);
  });
});
