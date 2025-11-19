import { useParams } from "react-router-dom";
import { useState } from "react";
// import ShopContext from "../store/shop";
import { Link } from "react-router-dom";
import classes from "./ProductItem.module.css";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { cartActions } from "../store/REDUX/cart";
import { apiFetch } from "../util/apiFetch";

export default function ProductItem() {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const dispatch = useDispatch();

  const { mutate } = useMutation({
    mutationFn: async ({ item, quantity }) => {
      const response = await apiFetch(`http://localhost:8080/shop/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item, quantity }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("장바구니 업데이트에 실패했습니다.");
      }
      return data.cart;
    },
    onSuccess: (cartData) => {
      // console.log(cartData);
      dispatch(cartActions.setCartItem(cartData));
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { data, isError, isLoading } = useQuery({
    queryKey: ["items", id],
    queryFn: async () => {
      const res = await apiFetch("http://localhost:8080/shop/products/" + id, {
      });
      const item = await res.json();
      //  console.log(item);
      if (!res.ok) {
        throw new Error("상품 정보를 불러오는 데 실패했습니다.");
      }
      return item;
    },

    staleTime: 1000 * 60 * 1, // 데이터가 신선하다고 간주되는 시간(밀리초 단위)
    cacheTime: 1000 * 60 * 5, // 사용되지 않는 데이터가 캐시에서 제거되기 전까지의 시간(밀리초 단위)
  });

  if (isLoading) {
    return <p className={classes.loading}>상품 정보를 불러오는 중입니다...</p>;
  }

  if (isError) {
    return (
      <p className={classes.error}>상품 정보를 불러오는 데 실패했습니다.</p>
    );
  }

  function addToCart(item, quantity) {
    // dispatch(cartActions.addToCart({ ...item, quantity }));
    mutate({ item, quantity });
  }

  return (
    <div className={classes.container}>
      <img
        src={`http://localhost:8080/${data.imageUrl}`}
        alt={data.title}
        className={classes.image}
      />
      <div className={classes.details}>
        <h2 className={classes.title}>{data.title}</h2>
        <p className={classes.price}>가격: {data.price} $</p>

        <div className={classes.quantityControl}>
          <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
          <p className={classes.quantity}>{quantity}</p>
          <button
            onClick={() =>
              setQuantity((prev) => {
                let count = prev - 1;
                if (count < 1) return 1;
                return count;
              })
            }
          >
            -
          </button>
        </div>

        <div className={classes.info}>
          <p>현재 수량: {quantity}</p>
          <p>총 금액: {data.price * quantity} $</p>
        </div>

        <div className={classes.buttons}>
          <Link to={`/payment/${data._id}`} className={classes.paymentLink}>
            <button onClick={() => addToCart(data, quantity)}>결제하기</button>
          </Link>
          <button
            onClick={() => {
              addToCart(data, quantity);
              setQuantity(1);
            }}
          >
            장바구니에 추가
          </button>
        </div>
      </div>
    </div>
  );
}
