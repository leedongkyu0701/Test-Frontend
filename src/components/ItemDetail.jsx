import { Link } from "react-router-dom";
import styles from "./ItemDetail.module.css";

import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../store/REDUX/cart";

import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../util/apiFetch";

export default function ItemDetail({ item, onClose }) {
  // const { cart, addToCart, deleteToCart, deleteToCartAll,toggleSelect } = useContext(ShopContext);
  const cart = useSelector((state) => state.cart.cartItem);
  const dispatch = useDispatch();

  const quantity =
    cart.find((cartItem) => cartItem._id === item._id)?.quantity || 0;

  const { mutate: updateCartMutate } = useMutation({
    mutationFn: async ({ item, method }) => {
      const response = await apiFetch(`http://localhost:8080/shop/cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: item._id, method }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("장바구니 업데이트에 실패했습니다.");
      }
      return data.cart;
    },
    onSuccess: (cart) => {
      // console.log(cart);
      dispatch(cartActions.setCartItem(cart));
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: deleteToCartAllMutate } = useMutation({
    mutationFn: async (itemId) => {
      const response = await apiFetch(`http://localhost:8080/shop/cart`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("장바구니 업데이트에 실패했습니다.");
      }
      return data.cart;
    },
    onSuccess: (cart) => {
      // console.log(cart);
      dispatch(cartActions.setCartItem(cart));
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const updateCart = ({ method }) => {
    updateCartMutate({ item, method });
  };

  const deleteToCartAll = (itemId) => {
    deleteToCartAllMutate(itemId);
  };

  return (
    <div className={styles.card}>
      <div
        className={`${styles.selectionDot} ${
          item.isSelected ? styles.selected : ""
        }`}
        onClick={() => {
          dispatch(cartActions.toggleItem(item._id));
        }} // 🔽 클릭 이벤트 추가
      />
      <img
        src={`http://localhost:8080/${item.imageUrl}`}
        alt={item.title}
        className={styles.image}
      />
      <div className={styles.info}>
        <h4 className={styles.title}>{item.title}</h4>
        <p className={styles.price}>{item.price} $</p>
        <div className={styles.quantityControl}>
          <button onClick={() => updateCart({ method: "decrement" })}>-</button>
          <p className={styles.quantity}>{quantity}</p>
          <button onClick={() => updateCart({ method: "increment" })}>+</button>
        </div>
        <div className={styles.buttons}>
          <Link to={`/payment/${item._id}`}>
            <button onClick={onClose} className={styles.orderBtn}>
              주문하기
            </button>
          </Link>
        </div>
      </div>
      <button
        className={styles.deleteBtn}
        onClick={() => deleteToCartAll(item._id)}
      >
        ×
      </button>
    </div>
  );
}
