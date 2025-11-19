import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { uiActions } from "../store/REDUX/ui.js";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: async (loginData) => {
      const res = await fetch(`http://localhost:8080/auth/login`, {
        method: "POST",
        body: loginData,
        credentials: "include", // 쿠키 전송을 위해 추가
      });
      
      const data = await res.json();
      if (!res.ok) {
        const message =
          data?.errors?.map((e) => e.msg).join("\n") ||
          data?.message ||
          "로그인 실패";
        throw new Error(message);
      }
      console.log("로그인 성공:", data);
      return data;
    },
    onSuccess: (data) => {
      alert("로그인이 완료되었습니다.");
      dispatch(uiActions.setIsLoggedIn(true));
      dispatch(uiActions.setAccessToken(data.accessToken));
      navigate("/");

    },
  });
  if (isLoading) {
    return <p>로그인 처리 중...</p>;
  }
  return (
    <section>
      <h2>로그인 페이지</h2>
      {isError && error.message && (
        <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>
          {error.message}
        </pre>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.target);
          mutate(formData);
        }}
      >
        <div>
          <label htmlFor="email">이메일:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">비밀번호:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">로그인</button>
      </form>
    </section>
  );
}
