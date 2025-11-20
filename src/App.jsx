import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import ProductItem from "./pages/ProuctItem";
import PaymentAll from "./pages/PaymentAll";
import Payment from "./pages/Payment";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { uiActions } from "./store/REDUX/ui.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> }, // 메인 홈
      { path: "products/:id", element: <ProductItem /> },
      { path: "products/:id/edit", element: <EditProduct /> },
      { path: "add-product", element: <AddProduct /> },
      { path: "paymentAll", element: <PaymentAll /> },
      { path: "payment/:id", element: <Payment /> },
      { path: "signup", element: <SignUp /> },
      { path: "login", element: <Login /> },
    ],
  },
]);
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("페이지 로드 - 인증 상태 확인 시작");

    async function verifyAuth() {
      try {
        const res = await fetch("https://test-br27.onrender.com/auth/refresh-token", {
          method: "POST",
          credentials: "include", // refreshToken 쿠키 전송 필수
          
        });
       
        if (res.ok) {
          const data = await res.json();
          // 새 accessToken을 Redux에 저장
          dispatch(uiActions.setAccessToken(data.accessToken));
          dispatch(uiActions.setIsLoggedIn(true));
          console.log("로그인 상태 복구 성공");
        } else {
          // refreshToken도 만료됐거나 없으면 로그아웃 상태
          dispatch(uiActions.setIsLoggedIn(false));
          dispatch(uiActions.setAccessToken(null));
          console.log("로그인 상태 없음");
        }
      } catch (err) {
        console.error("인증 확인 실패", err);
        dispatch(uiActions.setIsLoggedIn(false));
        dispatch(uiActions.setAccessToken(null));
      }
    }

    verifyAuth();
  }, [dispatch]); // dispatch만 의존성에 넣기

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
