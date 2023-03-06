import Link from "next/link";
import React from "react";

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="card">
      <Link href={`/products/${product.name}`}>
        <img
          src={product.image}
          className="rounded shadow"
          alt={product.name}
        />
      </Link>
      <div className="flex items-center justify-center flex-col p-5">
        <Link href={`/products/${product.name}`}>
          <h2 className="text-lg">{product.name}</h2>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <p>${product.price}</p>
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
