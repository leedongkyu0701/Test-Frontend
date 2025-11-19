// import {useContext} from "react"
// import ShopContext from "../store/shop"
import {useSelector} from "react-redux";

export default function PaymentAll(){
    const cart = useSelector(state => state.cart.cartItem);
    // console.log(cart);
    const totalgroup = cart.filter((item) => item.isSelected);
  const totalAmount = totalgroup.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
    return(
        <div>
            <h1>결제 페이지</h1>
            <p>총 금액: {totalAmount} $</p>
            <button>결제하기</button>
        </div>
    )
}
