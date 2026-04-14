import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { addToCart } from "@/Store/features/cart/cart.slice";
import { getAllProducts } from "@/Store/features/product/admin.product.slice";
import { getUserProfile, logout } from "@/Store/features/user/user.auth.slice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { user } = useSelector((state) => state.user);
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

  console.log(cart);

  return (
    <div className="container mx-auto px-3 py-15 max-w-7xl space-y-10">
      <section className="max-w-md mx-auto">
        <Card className="px-10">
          <h2 className="text-2xl text-center uppercase">User Profile</h2>
          <p className="text-lg"> {user?.name}</p>
          <p className="text-lg">{user?.email}</p>
          <div className="flex px-6 justify-end">
            <Button className=" mt-5" onClick={userLogout}>
              Logout
            </Button>
            <Button
              className=" mt-5 ml-3"
              onClick={() => navigate("/user/cart")}
            >
              View Cart ({cart?.length})
            </Button>
          </div>
        </Card>
      </section>
      <section>
        <h2 className="text-2xl text-start uppercase">Products List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <Card key={product._id} className="p-5">
              <div>
                <img
                  src={product?.images[0]}
                  alt={product?.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              </div>
              <h3 className="text-lg font-semibold">Name: {product?.name}</h3>
              <p className="text-sm font-bold">
                Price: ${product?.price?.toFixed(2)}
              </p>
              <p className="text-sm font-bold">Quantity: {product?.quantity}</p>

              <Button onClick={() => dispatch(addToCart(product))}>
                Add to Cart
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
