import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../store/REDUX/ui";
import styles from "./Pagination.module.css";

export default function Pagination() {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.ui.page);
  const maxPage = useSelector((state) => state.ui.maxPage);

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => dispatch(uiActions.setPage(page - 1))}
        disabled={page <= 1}
      >
        이전
      </button>

      <span>현재 페이지: {page}</span>

      <button onClick={() => dispatch(uiActions.setPage(page + 1))}
        disabled={page >= maxPage} // 예시로 최대 페이지를 5로 설정
      >
        다음
      </button>
    </div>
  );
}
