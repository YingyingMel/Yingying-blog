import React from 'react'
import './index.scss'
import Main from './main'
import Basket from './basket'
import data from './data'
import { useState } from 'react'

const ShoppingCart = () => {
  const { products } = data
  const [cartItem, setCartItem] = useState([])
  const onAdd = (product) => {
    //先判断购物车里之前是否添加过改商品
    const exist = cartItem.find(item => item.id === product.id)
    if (exist) {//购物车里之前已添加过该商品,在该商品的原来数量上+1
      setCartItem(
        cartItem.map(item =>
          item.id === product.id ? { ...exist, qty: exist.qty + 1 } : item
        )
      )
    } else {//新加入购物的商品
      setCartItem([...cartItem, { ...product, qty: 1 }])
    }
  }

  const onRemove = (product) => {
    const exist = cartItem.find(item => item.id === product.id)
    if (exist.qty === 1) {
      setCartItem(
        cartItem.filter(item => item.id !== product.id)
      )
    } else {
      setCartItem(
        cartItem.map(item =>
          item.id === product.id ? { ...exist, qty: exist.qty - 1 } : item
        )
      )
    }
  }


  return (
    <div className='shoppingCart'>
      <header className='block'>
        <div><h1>Shopping Cart</h1></div>
        <div className='row'>
          <a href="#/cart">
            Cart{' '}{cartItem.length > 0 ? <button className='badge'>{cartItem.length}</button> : ''}
          </a>
        </div>
      </header>
      <div className='row'>
        <Main products={products} onAdd={onAdd}></Main>
        <Basket onAdd={onAdd} onRemove={onRemove} cartItem={cartItem}></Basket>

      </div>
    </div>
  )
}

export default ShoppingCart