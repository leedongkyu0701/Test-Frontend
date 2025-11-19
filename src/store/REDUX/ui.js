import { createSlice} from "@reduxjs/toolkit";


const uiSlice = createSlice({
  name: "ui",
  initialState: {
    searchTerm: "",
    page: 1,
    maxPage: null,
    isLoggedIn: false,
    perPage: 2,

    accessToken: null, // 액세스 토큰 상태 추가
  },
  reducers: {
    setSearchTerm(state, action) {
        state.searchTerm = action.payload;
    },
    setPage(state, action) {
        state.page = action.payload;
    },
    setMaxPage(state, action) {
        state.maxPage = action.payload;
    },
    setIsLoggedIn(state, action) {
        state.isLoggedIn = action.payload;
    },
    setAccessToken(state, action) {
        state.accessToken = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;