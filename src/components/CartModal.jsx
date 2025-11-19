// import { useContext} from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
// import ShopContext from "../store/shop";
import ItemDetail from "./ItemDetail";
import styles from "./CartModal.module.css";

import { useDispatch,useSelector } from "react-redux";
import { cartActions } from "../store/REDUX/cart";
import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "../util/apiFetch";

export default function CartModal({ onClose }) {
  const cart = useSelector(state => state.cart.cartItem);
  
 useQuery({
    queryKey: ['cart'],
    queryFn: async() => {
      const res = await apiFetch("https://test-br27.onrender.com/shop/cart", );
      const data = await res.json();
      if(!res.ok){
        throw new Error("장바구니 정보를 불러오는 데 실패했습니다.");
      }
      console.log(data);
      dispatch(cartActions.setCartItem(data.cart));
      return data.cart;
    },

    staleTime: 1000 * 60 * 1, // 데이터가 신선하다고 간주되는 시간(밀리초 단위)
    cacheTime: 1000 * 60 * 5, // 사용되지 않는 데이터가 캐시에서 제거되기 전까지의 시간(밀리초 단위)
  })

  const isAllSelected = useSelector(state => state.cart.isAllSelected);
  const dispatch = useDispatch();
  
  function toggleAll() {
    dispatch(cartActions.toggleAllItem());
  }

  const totalgroup = cart.filter((item) => item.isSelected);
  const totalAmount = totalgroup.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return createPortal(
    <dialog open className={styles.dialog}>
      <h3 className={styles.title}>🛍 Shopping Cart</h3>
      <div>
        <div
            className={`${styles.selectionDot} ${
              isAllSelected ? styles.selected : ""
            }`}
            onClick={() => {
              toggleAll();
            }}
          />
        <ul className={styles.list}>
          
          {cart.length === 0 ? (
            <p>장바구니가 비어 있습니다.</p>
          ) : (
            cart.map((item) => (
              <li key={item._id} className={styles.item}>
                <ItemDetail onClose={onClose} item={item} />
              </li>
            ))
          )}
        </ul>
      </div>
      <div className={styles.total}>총 상품금액: {totalAmount} $</div>
      <div className={styles.buttons}>
        <Link to="/paymentAll">
          <button
            className={styles.paymentBtn}
            onClick={onClose}
            disabled={cart.length === 0}
          >
            결제하기
          </button>
        </Link>
        <button className={styles.closeBtn} onClick={onClose}>
          닫기
        </button>
      </div>
    </dialog>,
    document.getElementById("modal")
  );
}
