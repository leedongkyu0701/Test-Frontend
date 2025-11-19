import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { apiFetch } from "../util/apiFetch";

export default function SortBar() {
  const page = useSelector((state) => state.ui.page);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["items-sort", page],
    queryFn: async () => {
      const res = await apiFetch(
        `https://test-br27.onrender.com/shop/products/?page=${page}&perPage=2`,
        {}
      );
      if (!res.ok) throw new Error("상품 정보를 불러오지 못했습니다.");
      const items = await res.json();
      return items.products;
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return null;
  if (isError) return null;

  function handleSort(type) {
    if (!Array.isArray(data)) return;

    let sorted = [...data];
    if (type === "asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else {
      sorted.sort((a, b) => b.price - a.price);
    }
    queryClient.setQueryData(["items", page], sorted);
    console.log(page, sorted);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        margin: "20px",
      }}
    >
      <button
        style={{ backgroundColor: "lightblue" }}
        onClick={() => handleSort("asc")}
      >
        금액 낮은 순
      </button>

      <button
        style={{ backgroundColor: "lightcoral" }}
        onClick={() => handleSort("desc")}
      >
        금액 높은 순
      </button>
    </div>
  );
}
