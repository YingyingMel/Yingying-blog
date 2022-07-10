import React from 'react'

const Basket = (props) => {
  const { cartItem, onAdd, onRemove } = props
  const itemsPrice = cartItem.reduce((a, b) => a + b.price * b.qty, 0)
  const taxPrice = itemsPrice * 0.14
  const shippingPrice = itemsPrice > 2000 ? 0 : 20
  const totalPrice = itemsPrice + taxPrice + shippingPrice
  return (
    <aside className='block col-1'>
      <h2>Cart Items</h2>
      <div>{cartItem.length === 0 && <div>Cart is empty</div>}</div>
      {cartItem.map((item) => {
        return (
          <div key={item.id} className='row'>
            <div className='col-2'>{item.name}</div>
            <div className='col-2'>
              <button onClick={() => { onAdd(item) }} className='add'>+</button>
              <button onClick={() => { onRemove(item) }} className='remove'>-</button>
            </div>
            <div className='col-2 text-right'>
              {item.qty} x ${item.price.toFixed(2)}
            </div>
          </div>)
      })}
      {cartItem.length > 0 && (
        <>
          <hr></hr>
          <div className='row'>
            <div className='col-2'>Items Price</div>
            <div className='col-1 text-right'>${itemsPrice.toFixed(2)}</div>
          </div>
          <div className='row'>
            <div className='col-2'>Tax Price</div>
            <div className='col-1 text-right'>${taxPrice.toFixed(2)}</div>
          </div>
          <div className='row'>
            <div className='col-2'>Shipping Price</div>
            <div className='col-1 text-right'>${shippingPrice.toFixed(2)}</div>
          </div>
          <div className='row'>
            <div className='col-2'><strong>Total Price</strong></div>
            <div className='col-1 text-right'><strong>${totalPrice.toFixed(2)}</strong></div>
          </div>
          <hr></hr>
          <button onClick={() => alert('Implement Chechout')}>Chechout</button>
        </>
      )}




    </aside >
  )
}

export default Basket