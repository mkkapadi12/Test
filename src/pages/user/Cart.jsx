import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { removeFromCart, updateCart } from "@/Store/features/cart/cart.slice";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(cart);

  const Subtotal = cart?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-900"
              onClick={() => navigate("/user/dashboard")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <ShoppingCart className="w-5 h-5" />
              <span>Your Cart</span>
            </div>
          </div>
          <span className="text-sm text-gray-500"></span>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-8">
        {cart?.length === 0 || !cart ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <ShoppingCart className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8 max-w-sm">
              Looks like you haven't added anything to your cart yet. Browse our
              products and find something you love!
            </p>
            <Button
              className="bg-gray-900 text-white hover:bg-gray-800 h-11 px-8 font-semibold"
              onClick={() => navigate("/user/dashboard")}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          /* Cart Content */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart?.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 hover:border-gray-300 transition-colors"
                >
                  {/* Product Image */}
                  <div className="w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-gray-50">
                    {item.images.length > 0 ? (
                      item.images.map((img) =>
                        img.isPrimary ? (
                          <img
                            key={img.public_id}
                            src={img.url}
                            alt={item?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : null,
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-10 h-10 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="font-semibold text-base truncate">
                        {item?.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        ${item?.price?.toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-40"
                          disabled={item?.quantity <= 1}
                          onClick={() =>
                            dispatch(
                              updateCart({
                                itemId: item?._id,
                                quantity: item?.quantity - 1,
                              }),
                            )
                          }
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold select-none border-x border-gray-200">
                          {item?.quantity}
                        </span>
                        <button
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                          onClick={() =>
                            dispatch(
                              updateCart({
                                itemId: item?._id,
                                quantity: item?.quantity + 1,
                              }),
                            )
                          }
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Line Total */}
                        <span className="font-bold text-base">
                          ${(item?.price * item?.quantity).toFixed(2)}
                        </span>

                        {/* Remove Button */}
                        <button
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          onClick={() => dispatch(removeFromCart(item?._id))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Order Summary</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-green-600 font-medium">
                      ${Subtotal}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Total Items</span>
                    <span className="text-green-600 font-medium">
                      {cart.length}
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-medium text-sm text-center w-full">
                  <span className="text-center w-full">Discount applied in checkout</span>
                </div>

                <Button
                  onClick={() => navigate("/user/checkout")}
                  className="w-full mt-6 bg-gray-900 text-white hover:bg-gray-800 h-11 font-semibold"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="ghost"
                  className="w-full mt-2 text-gray-500 hover:text-gray-900 h-10 text-sm"
                  onClick={() => navigate("/user/dashboard")}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
