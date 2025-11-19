import { Link } from "react-router-dom";
import logoImg from "../assets/logo.png";
import styles from "./MainNav.module.css";
import CartModal from "./CartModal";
import { useState } from "react";

import { uiActions } from "../store/REDUX/ui.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { apiFetch } from "../util/apiFetch.js";

export default function MainNav() {
  const [isopen, setIsopen] = useState(false);
  // const {setSearchTerm} = useContext(ShopContext);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.ui.isLoggedIn);

  async function logoutHandler() {
    const res = await apiFetch("https://test-br27.onrender.com/auth/logout", {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "로그아웃에 실패했습니다.");
      return;
    }
    alert("로그아웃 되었습니다.");
    dispatch(uiActions.setIsLoggedIn(false));
  }

  return (
    <>
      {isopen && <CartModal onClose={() => setIsopen(false)} />}
      <nav className={styles.navbar}>
        <div
          className={styles.logo}
          onClick={() => dispatch(uiActions.setPage(1))}
        >
          <Link to="/">
            <img src={logoImg} alt="Logo" />
          </Link>
        </div>

        <input
          onChange={(e) => {
            dispatch(uiActions.setSearchTerm(e.target.value));
          }}
          className={styles.searchInput}
          placeholder="Search..."
        />

        <div className={styles.navItems}>
          <p
            onClick={() => {
              setIsopen(true);
            }}
          >
            장바구니
          </p>
          <p>
            <Link to="/add-product">상품 추가</Link>
          </p>
          {isLoggedIn && <p onClick={logoutHandler}>로그아웃</p>}
          {!isLoggedIn && (
            <>
              <p>
                <Link to="/login">로그인</Link>
              </p>
              <p>
                <Link to="/signup">회원가입</Link>
              </p>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
