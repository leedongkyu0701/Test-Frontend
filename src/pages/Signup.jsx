import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";


export default function SignUp() {
  const navigate = useNavigate();
    
  const { mutate, isLoading , isError, error} = useMutation({
    mutationFn: async (userData) => {
      const res = await fetch(`https://test-br27.onrender.com/auth/signup`, {
        method: "POST",
        body: userData,
      });
      const data = await res.json();
      if (!res.ok) {
        const message =
          data?.errors?.map((e) => e.msg).join("\n") ||
          data?.message ||
          "회원가입 실패";
        throw new Error(message);
      }
      return data;
    },
    onSuccess: () => {
        alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
        navigate("/");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    mutate(formData);
  };

  if (isLoading) {
    return <p>회원가입 처리 중...</p>;
  }
  

  return (

    <section>
        {isError && error.message && (
  <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>{error.message}</pre>
)}
      <h2>회원가입 페이지</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">이메일:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">비밀번호:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div>
          <label htmlFor="passwordConfirm">비밀번호 확인:</label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            required
          />
        </div>

        <button type="submit">회원가입</button>
      </form>
    </section>
  );
}
