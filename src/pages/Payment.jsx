// import {useContext,} from "react"
import { useParams } from "react-router-dom";
// import ShopContext from "../store/shop"

import {useSelector} from "react-redux";

export default function Payment(){
    // const {cart} = useContext(ShopContext);
    const cart = useSelector(state => state.cart.cartItem);
    const {id} = useParams();
    // console.log(cart);

    // console.log(id.toString());
    const selected = cart.find(item => item._id.toString() === id.toString());
    // console.log(selected);
    const totalAmount = selected.price * selected.quantity;

    return(
        <div>
            <h1>결제 페이지</h1>
            <p>총 금액: {totalAmount} $</p>
            <button>결제하기</button>
        </div>
    )
}
