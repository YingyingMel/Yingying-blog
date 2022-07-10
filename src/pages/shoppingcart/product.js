import React from 'react'

const Product = (props) => {
  const { product, onAdd } = props

  return (
    <div className='item'>
      <img className='small' src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <div>${product.price}</div>
      <button onClick={() => onAdd(product)}>Add to Cart</button>
    </div>
  )
}

export default Product