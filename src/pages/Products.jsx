import ProductsList from "../components/ProductsList";
import Pagination from "../components/Pagination";
import SortBar from "../components/SortBar";

import { useSelector } from "react-redux";

export default function Products() {
  const isLoggedIn = useSelector((state) => state.ui.isLoggedIn);

  if (!isLoggedIn) {
    return <p>상품 정보를 보려면 로그인하세요.</p>;
  }

  return (
    <>
      <SortBar />
      <ProductsList />
      <Pagination />
    </>
  );
}
