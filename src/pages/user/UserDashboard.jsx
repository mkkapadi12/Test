import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  ShoppingCart,
  Package,
  LayoutDashboard,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { addToCart } from "@/Store/features/cart/cart.slice";
import { getAllProducts } from "@/Store/features/product/admin.product.slice";
import { getUserProfile, logout } from "@/Store/features/user/user.auth.slice";

const UserDashboard = () => {
  const { user, loading } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const { cart } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogout = () => {
    dispatch(logout());
    navigate("/user/login");
  };

  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(getAllProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <LayoutDashboard className="w-6 h-6" />
            <span>StorePortal</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50 h-9"
              onClick={() => navigate("/user/cart")}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart</span>
              <span className="bg-gray-900 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                {cart?.length || 0}
              </span>
            </Button>

            <Separator
              orientation="vertical"
              className="h-6 mx-2 hidden md:block"
            />

            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold leading-none">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-gray-500 hover:text-gray-900"
                onClick={userLogout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Browse our latest collection and find something you love today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-gray-900 text-white hover:bg-gray-800"
              onClick={() => navigate("/user/cart")}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Your Cart
            </Button>
          </div>
        </div>

        {/* Products Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-gray-900" />
              <h2 className="text-2xl font-bold">Featured Products</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map((product) => (
              <Card
                key={product._id}
                className="group overflow-hidden border-gray-200 hover:border-gray-900 transition-all duration-300 hover:shadow-lg bg-white flex flex-col h-full"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  {product?.images?.length > 0 ? (
                    product?.images?.map((image) =>
                      image.isPrimary === true ? (
                        <img
                          key={image.public_id}
                          src={image.url}
                          alt={product?.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : null,
                    )
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      No Image
                    </div>
                  )}

                  {product.quantity < 5 && (
                    <div className="absolute top-2 left-2 bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100">
                      LOW STOCK: {product.quantity}
                    </div>
                  )}
                </div>

                <CardHeader className="p-4 grow">
                  <CardTitle className="text-lg font-bold truncate line-clamp-1">
                    {product?.name}
                  </CardTitle>
                  <CardDescription className="text-gray-500 flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-xl">
                      ${product?.price?.toFixed(2)}
                    </span>
                    <span className="text-xs">
                      • Available: {product?.stock}
                    </span>
                    {/* <span className="text-xs">
                      • Discount: {product?.discount}% off
                    </span> */}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="p-4 pt-0">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors h-10 font-semibold"
                    onClick={() => dispatch(addToCart(product))}
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {products?.length === 0 && (
            <div className="text-center py-20 bg-gray-100 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">
                No products available at the moment.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="py-8 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} StorePortal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;
