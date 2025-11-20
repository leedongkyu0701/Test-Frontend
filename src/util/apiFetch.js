import store from "../store/REDUX/index.js";
import { uiActions } from "../store/REDUX/ui.js";

export async function apiFetch(url, options = {}) {
  let accessToken = store.getState().ui.accessToken;
  console.log("현재 액세스 토큰:", accessToken);

  let res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : ``,
    },
  });

  // --- 401 = 엑세스토큰 만료됨 ---

  if (res.status === 401) {
    console.log("엑세스 토큰 만료로 401 응답 받음, 갱신 시도");
    const refreshRes = await fetch("https://test-br27.onrender.com/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.status === 401) {
      console.log("리프레시 토큰도 만료됨, 로그아웃 처리");
      store.dispatch(uiActions.setIsLoggedIn(false));
      store.dispatch(uiActions.setAccessToken(null));
      return res;
    }

    const { accessToken } = await refreshRes.json();
    console.log("새 액세스 토큰 받음:", accessToken);

    // 새 토큰 저장
    store.dispatch(uiActions.setAccessToken(accessToken));

    // 원래 요청을 새 토큰으로 다시 시도
    res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return res;
}
