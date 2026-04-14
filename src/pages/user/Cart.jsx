import { Button } from "@/components/ui/button";
import { removeFromCart, updateCart } from "@/Store/features/cart/cart.slice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Cart = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  console.log(cart);

  const totalItems = cart?.reduce((total, item) => total + item.itemNumber, 0);

  const discount = totalItems >= 5 ? 5 : 0;

  const totalAmount = cart
    ?.reduce((total, item) => total + item.price * item.itemNumber, 0)
    .toFixed(2);

  return (
    <div>
      <h2 className="text-2xl text-center uppercase">Cart Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cart?.map((item) => (
          <div key={item._id} className="p-5 border rounded-md">
            <div>
              <img
                src={item?.images[0]}
                alt={item?.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            </div>
            <h3 className="text-lg font-semibold">Name: {item?.name}</h3>
            <p className="text-sm font-bold">
              Price: ${item?.price?.toFixed(2)}
            </p>
            <p className="text-sm font-bold">Quantity: {item?.quantity}</p>
            <p className="text-sm font-bold">
              Total Purchased: {item?.itemNumber}
            </p>
            <div className="flex justify-between mt-3">
              <div>
                <Button onClick={() => dispatch(removeFromCart(item?._id))}>
                  Remove
                </Button>
              </div>
              <div>
                <Button
                  onClick={() =>
                    dispatch(
                      updateCart({
                        itemId: item?._id,
                        quantity: item?.itemNumber + 1,
                      }),
                    )
                  }
                >
                  +
                </Button>
                <span className="mx-2">{item?.itemNumber}</span>
                <Button
                  onClick={() =>
                    dispatch(
                      updateCart({
                        itemId: item?._id,
                        quantity: item?.itemNumber - 1,
                      }),
                    )
                  }
                >
                  -
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {cart?.length === 0 && (
        <h2 className="text-2xl text-center uppercase mt-5">
          Your cart is empty!
        </h2>
      )}
      {cart?.length > 0 && (
        <div>
          <h2 className="text-2xl text-start capitalize mt-5">
            Total Amount:{"   "}$
            {cart
              ?.reduce((total, item) => total + item.price * item.itemNumber, 0)
              .toFixed(2)}
          </h2>
          <h2>
            Discount:{"   "}
            {discount}%
          </h2>

          <h2>
            Total Items:{"   "}
            {cart?.reduce((total, item) => total + item.itemNumber, 0)}
          </h2>
          <h2>
            Final Amount:{"   "}$
            {(totalAmount * (1 - discount / 100)).toFixed(2)}
          </h2>
        </div>
      )}
    </div>
  );
};

export default Cart;
