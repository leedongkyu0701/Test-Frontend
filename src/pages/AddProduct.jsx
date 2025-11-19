import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../util/apiFetch";


export default function AddProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isError, isLoading, error } = useMutation({
    mutationFn: async (newProduct) => {
      const res = await apiFetch("https://test-br27.onrender.com/shop/products", {
        method: "POST",
        body: newProduct,
      });
      const data = await res.json();
      if (!res.ok) {
        const message =
          data?.errors?.map((e) => e.msg).join(", ") ||
          data?.message ||
          "상품 추가 실패";
        throw new Error(message);
      }
      return data;
    },
    onSuccess: () => {
      // 쿼리 무효화: 특정 쿼리를 무효화하여 다음번에 해당 쿼리가 다시 실행되도록 함
      // 새로 생된 이벤트를 포함하여 최신 데이터를 가져오기 위함
      queryClient.invalidateQueries({ queryKey: ["items"] }); // items 를 포함하는 모든 쿼리 무효화(검색어 포함된 쿼리도 무효화)
      navigate("/");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    mutate(formData);
  };

  return (
    <>
      {isError && error.message && <p>{error.message}</p>}
      <section>
        <h2>상품 추가 페이지</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">상품명:</label>
            <input type="text" id="title" name="title" required />
          </div>
          <div>
            <label htmlFor="price">가격:</label>
            <input type="number" id="price" name="price" required />
          </div>
          <div>
            <label htmlFor="description">설명:</label>
            <textarea id="description" name="description" required></textarea>
          </div>
          <div>
            <label htmlFor="image">이미지 URL:</label>
            <input type="file" id="image" name="image" accept="image/*" required />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "등록 중..." : "상품 추가"}
          </button>
        </form>
      </section>
    </>
  );
}
