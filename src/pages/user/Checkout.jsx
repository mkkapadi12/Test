import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  Smartphone,
  MapPin,
  Loader2,
  CheckCircle2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import privateAPI from "@/Store/services/PrivateAPI";
import { toast } from "sonner";

const PAYMENT_METHODS = [
  { id: "COD", label: "Cash on Delivery", icon: Banknote },
  { id: "CARD", label: "Card Payment", icon: CreditCard },
  { id: "UPI", label: "UPI", icon: Smartphone },
];

const Checkout = () => {
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // Calculate totals
  const subtotal = cart?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  ) || 0;

  const totalQuantity = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Apply 10% discount if 5+ items
  const discountPercentage = totalQuantity >= 5 ? 10 : 0;
  const discountAmount = (subtotal * discountPercentage) / 100;
  const total = subtotal - discountAmount;

  // Get primary image for a cart item
  const getPrimaryImage = (item) => {
    const primary = item.images?.find((img) => img.isPrimary);
    return primary?.url || item.images?.[0]?.url || null;
  };

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.pincode || !address.phone) {
      toast.error("Please fill in all address fields");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: address,
        paymentMethod,
      };

      await privateAPI.post("/order/create", orderData);

      // Clear cart
      localStorage.removeItem("testcart");
      setOrderPlaced(true);
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to place order",
      );
    } finally {
      setLoading(false);
    }
  };

  // Order success state
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-8">
            Your order has been placed successfully. You will receive a
            confirmation shortly.
          </p>
          <Button
            className="bg-gray-900 text-white hover:bg-gray-800 h-11 px-8 font-semibold"
            onClick={() => {
              window.location.href = "/user/dashboard";
            }}
          >
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  // Empty cart redirect
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Nothing to checkout</h2>
          <p className="text-gray-500 mb-8">
            Your cart is empty. Add some products first.
          </p>
          <Button
            className="bg-gray-900 text-white hover:bg-gray-800 h-11 px-8 font-semibold"
            onClick={() => navigate("/user/dashboard")}
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-5xl px-4 h-16 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-900"
            onClick={() => navigate("/user/cart")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-xl tracking-tight">Checkout</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column — Forms */}
          <div className="lg:col-span-3 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <MapPin className="w-5 h-5 text-gray-900" />
                <h2 className="font-bold text-lg">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-sm text-gray-600">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleAddressChange}
                    placeholder="John Doe"
                    className="border-gray-300 focus-visible:ring-gray-900 h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm text-gray-600">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    placeholder="+91 98765 43210"
                    className="border-gray-300 focus-visible:ring-gray-900 h-10"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="street" className="text-sm text-gray-600">
                    Street Address
                  </Label>
                  <Input
                    id="street"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    placeholder="123 Main Street, Apt 4B"
                    className="border-gray-300 focus-visible:ring-gray-900 h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-sm text-gray-600">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="Mumbai"
                    className="border-gray-300 focus-visible:ring-gray-900 h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-sm text-gray-600">
                    State
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    placeholder="Maharashtra"
                    className="border-gray-300 focus-visible:ring-gray-900 h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pincode" className="text-sm text-gray-600">
                    PIN Code
                  </Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    placeholder="400001"
                    className="border-gray-300 focus-visible:ring-gray-900 h-10"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="w-5 h-5 text-gray-900" />
                <h2 className="font-bold text-lg">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isActive = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                        isActive
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 shrink-0 ${
                          isActive ? "text-gray-900" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          isActive ? "text-gray-900" : "text-gray-600"
                        }`}
                      >
                        {method.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column — Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-5">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                      {getPrimaryImage(item) ? (
                        <img
                          src={getPrimaryImage(item)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × ${item.price?.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-5" />

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>

                {discountPercentage > 0 ? (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discountPercentage}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-gray-400">
                    <span>Discount</span>
                    <span className="text-xs">
                      Add {5 - totalQuantity} more for 10% off
                    </span>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Button
                className="w-full mt-6 bg-gray-900 text-white hover:bg-gray-800 h-12 font-semibold text-base"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  `Place Order — $${total.toFixed(2)}`
                )}
              </Button>

              <p className="text-xs text-center text-gray-400 mt-3">
                By placing this order you agree to our terms & conditions.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
