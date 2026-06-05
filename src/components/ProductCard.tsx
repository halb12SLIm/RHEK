import React from "react";
import { Product } from "../types";
import { Plus, Minus, Check, Coffee, Package, ShieldCheck } from "lucide-react";

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  selectedSize: string;
  onAddToCart: (size: string, qty: number) => void;
  onRemoveFromCart: () => void;
}

export default function ProductCard({
  product,
  quantityInCart,
  selectedSize,
  onAddToCart,
  onRemoveFromCart,
}: ProductCardProps) {
  const [localQty, setLocalQty] = React.useState(1);
  const [chosenSize, setChosenSize] = React.useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ""
  );

  return (
    <div
      id={`product-card-${product.id}`}
      className="relative flex flex-col justify-between bg-gradient-to-b from-[#1c1e22] to-[#121316] border border-white/5 hover:border-amber-500/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-950/20 group"
    >
      {/* Decorative Gold Corner */}
      <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none rounded-tr-2xl">
        <div className="absolute top-[-10px] right-[-10px] w-6 h-6 rotate-45 bg-[#c5a059] opacity-40"></div>
      </div>

      <div>
        {/* Category Indicator */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 mb-3 font-mono">
          <Package className="w-3 h-3" />
          {product.qtyPerUnit} حبة / {product.unitAr}
        </span>

        {/* Product Names */}
        <h3 className="text-lg font-bold text-gray-100 group-hover:text-amber-300 transition-colors duration-200 mt-1">
          {product.nameAr}
        </h3>
        <p className="text-xs text-gray-500 font-mono mt-0.5">{product.name}</p>

        {/* Description */}
        <p className="text-sm text-gray-400 mt-3 leading-relaxed">
          {product.descriptionAr}
        </p>

        {/* Size Selection (if product has sizes) */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-4">
            <label className="block text-xs text-amber-400/80 mb-1.5 font-medium">🛡️ اختر المقاس المطلوب:</label>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  id={`btn-size-${product.id}-${sz}`}
                  onClick={() => setChosenSize(sz)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                    chosenSize === sz
                      ? "bg-amber-500/20 border-amber-500 text-amber-300"
                      : "bg-black/20 border-white/5 text-gray-400 hover:border-white/10 hover:text-gray-300"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-gray-500 block">السعر التقريبي للـ {product.unitAr}</span>
            <span className="text-lg font-bold text-amber-400 font-mono">
              {(product.priceSyp).toLocaleString("ar-SY")} ل.س
            </span>
          </div>

          {quantityInCart > 0 ? (
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <Check className="w-3 h-3" /> مضاف للطلب ({quantityInCart} {product.unitAr})
              </span>
              <div className="flex items-center gap-1">
                <button
                  id={`btn-dec-cart-${product.id}`}
                  onClick={() => onAddToCart(chosenSize, Math.max(0, quantityInCart - 1))}
                  className="p-1 px-2 text-xs bg-black/40 border border-white/5 rounded hover:bg-black text-gray-400"
                >
                  -
                </button>
                <span className="px-2 text-sm text-gray-200 font-mono font-bold">{quantityInCart}</span>
                <button
                  id={`btn-inc-cart-${product.id}`}
                  onClick={() => onAddToCart(chosenSize, quantityInCart + 1)}
                  className="p-1 px-2 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded hover:bg-amber-500/20"
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Quantity Changer */}
              <div className="flex items-center bg-black/30 border border-white/5 rounded-xl p-1 overflow-hidden">
                <button
                  id={`btn-dec-qty-${product.id}`}
                  onClick={() => setLocalQty(Math.max(1, localQty - 1))}
                  className="p-1 text-gray-400 hover:text-white transition-colors duration-150"
                  type="button"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3.5 text-sm font-semibold text-gray-300 font-mono">{localQty}</span>
                <button
                  id={`btn-inc-qty-${product.id}`}
                  onClick={() => setLocalQty(localQty + 1)}
                  className="p-1 text-gray-400 hover:text-white transition-colors duration-150"
                  type="button"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Quote Button */}
              <button
                id={`btn-add-quote-${product.id}`}
                onClick={() => {
                  onAddToCart(chosenSize, localQty);
                  setLocalQty(1); // reset after add
                }}
                className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 border border-amber-400/20 rounded-xl text-xs font-bold text-gray-950 shadow-lg shadow-amber-500/10 active:scale-95 transition-all duration-150 cursor-pointer"
              >
                أضف للطلب
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
