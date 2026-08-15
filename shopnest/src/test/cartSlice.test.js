import { describe, it, expect } from 'vitest';
import cartReducer, {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} from '../store/cartSlice';

const sampleProduct = { id: 1, title: 'Test Product', price: 29.99, image: 'img.jpg', category: 'electronics' };

describe('cartSlice', () => {
  it('should return the initial state', () => {
    expect(cartReducer(undefined, {})).toEqual({ items: [] });
  });

  it('should add a new product to cart', () => {
    const state = cartReducer(undefined, addToCart(sampleProduct));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(1);
  });

  it('should increase quantity when same product added again', () => {
    let state = cartReducer(undefined, addToCart(sampleProduct));
    state = cartReducer(state, addToCart(sampleProduct));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it('should remove a product from cart', () => {
    let state = cartReducer(undefined, addToCart(sampleProduct));
    state = cartReducer(state, removeFromCart(1));
    expect(state.items).toHaveLength(0);
  });

  it('should increase quantity with increaseQty', () => {
    let state = cartReducer(undefined, addToCart(sampleProduct));
    state = cartReducer(state, increaseQty(1));
    expect(state.items[0].quantity).toBe(2);
  });

  it('should decrease quantity with decreaseQty', () => {
    let state = cartReducer({ items: [{ ...sampleProduct, quantity: 3 }] }, decreaseQty(1));
    expect(state.items[0].quantity).toBe(2);
  });

  it('should remove item when decreaseQty reaches 0', () => {
    let state = cartReducer({ items: [{ ...sampleProduct, quantity: 1 }] }, decreaseQty(1));
    expect(state.items).toHaveLength(0);
  });

  it('should clear all items', () => {
    let state = cartReducer({ items: [{ ...sampleProduct, quantity: 1 }] }, clearCart());
    expect(state.items).toHaveLength(0);
  });
});
