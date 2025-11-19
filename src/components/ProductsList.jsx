import { useSelector } from "react-redux";

import styles from "./ProductsList.module.css";
import { Link } from "react-router-dom";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { uiActions } from "../store/REDUX/ui.js";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { apiFetch } from "../util/apiFetch.js";
import { socket } from "../util/socket.js";

export default function ProductsList() {
  const searchTerm = useSelector((state) => state.ui.searchTerm);
  const page = useSelector((state) => state.ui.page);
  const perPage = useSelector((state) => state.ui.perPage);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  useEffect(() => {
    // 처음 컴포넌트가 마운트될 때 소켓 이벤트 리스너 설정
    // productsUpdated 이벤트 수신 시 해당 쿼리 무효화 => 최신 데이터 다시 가져오기
    socket.on("productsUpdated", () => {
      queryClient.invalidateQueries(["items"]);
    });

    return () => socket.off("productsUpdated");
  }, [queryClient]);
  // 한 클라이언트에서 발생한 상품 추가/삭제 요청을 서버가 모든 클라이언트에게 브로드캐스트해서 모든 클라이언트의 화면이 즉시 업데이트되도록 하는 것.

  const {
    mutate,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationFn: async (id) => {
      const res = await apiFetch(
        `http://localhost:8080/shop/products/${id}?perPage=${perPage}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        const message = data?.message || "상품 삭제 실패";
        throw new Error(message);
      }
      return data;
    },
    onSuccess: (data) => {
      if (page > data.maxPage) {
        dispatch(uiActions.setPage(data.maxPage));
      }

      queryClient.invalidateQueries(["items", page]); // items 를 포함하는 모든 쿼리 무효화(검색어 포함된 쿼리도 무효화)
    },
  });

  const { data, isError, isLoading, error } = useQuery({
    // tanstack-query ver.
    queryKey: ["items", page],
    queryFn: async () => {
      const res = await apiFetch(
        `http://localhost:8080/shop/products/?page=${page}&perPage=${perPage}`
      ); // 백엔드에서 데이터 받아오기
      const data = await res.json();
      // console.log(data);

      if (!res.ok) {
        // 에러 처리 res(200-299)가 아니면 잡음
        const message = data.message;
        throw new Error(message || "상품 정보를 불러오는 데 실패했습니다.");
      }
      dispatch(uiActions.setMaxPage(data.maxPage));
      return data.products;
    },
    staleTime: 1000 * 60 * 5, // 데이터가 신선하다고 간주되는 시간(밀리초 단위)
    cacheTime: 1000 * 60 * 5, // 사용되지 않는 데이터가 캐시에서 제거되기 전까지의 시간(밀리초 단위)
  });

  if (isLoading) {
    return <p>상품 정보를 불러오는 중입니다...</p>;
  }

  let searchedItems = data;
  if (searchTerm)
    searchedItems = data?.filter((item) => item.title.includes(searchTerm));
    // console.log(searchedItems);
  if(searchedItems.length === 0){
    return <p>검색된 상품이 없습니다.</p>;
  }

  return (
    <>
      {isError && error.message && <p>{error.message}</p>}
      {isDeleteError && deleteError.message && <p>{deleteError.message}</p>}
      <ul className={styles.productsList}>
        {searchedItems.map((item) => (
          <li key={item._id} className={styles.productItem}>
            <Link to={`/products/${item._id}`}>
              <img
                src={`http://localhost:8080/${item.imageUrl}`}
                alt={item.title}
              />
              <h2>{item.title}</h2>
              <p>{item.price} $</p>
            </Link>
            <Link to={`/products/${item._id}/edit`} className={styles.editLink}>
              수정
            </Link>
            <button
              onClick={() => mutate(item._id)}
              className={styles.deleteLink}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
