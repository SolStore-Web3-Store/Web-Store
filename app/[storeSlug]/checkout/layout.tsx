import React from 'react'

const CheckoutLayout = ({params}: {params: {storeSlug: string}}) => {
  return (
    <div>CheckoutLayout + {params.storeSlug}</div>
  )
}

export default CheckoutLayout