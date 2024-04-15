import React, { useContext } from 'react';
import './CartItems.css';
import remove_icon from '../Assets/cart_cross_icon.png';
import { ShopContext } from '../Context/ShopContext';

const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);

    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {Object.keys(cartItems).map((id) => {
                const item = all_product.find((product) => product.id === Number(id));
                if (item) {
                    return (
                        <div key={id}>
                            <div className="cartitems-format cartitems-format-main">
                                <img src={item.image} className='carticon-product-icon' alt="" />
                                <p>{item.name}</p>
                                <p>${item.new_price.toFixed(2)}</p>
                                <button className='cartitems-quantity'>{cartItems[id]}</button>
                                <p>${(item.new_price * cartItems[id]).toFixed(2)}</p>
                                <img className='cartitems-remove-icon' src={remove_icon} onClick={() => { removeFromCart(id) }} alt="" />
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            })}
            {Object.keys(cartItems).length === 0 && (
                <div className="cartitems-no-items">Your cart is empty</div>
            )}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount().toFixed(2)}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>${getTotalCartAmount().toFixed(2)}</h3>
                        </div>
                    </div>
                    <button className="cartitems-proceed-btn">PROCEED TO CHECKOUT</button>
                </div>
                <div className="cartitems-promocode">
                    <label htmlFor="promoCode">If you have a promo code, enter it here:</label>
                    <div className="cartitems-promobox">
                        <input type="text" id="promoCode" placeholder='promo code' />
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItems;
