import { NavigateOptions, useLocation, useNavigate } from "react-router-dom";

export default function useNav() {
  const nav = useNavigate();
  const location = useLocation();

  return {
    ...location,
    nav,
    navEntry: () => nav("/console"),
    navByDelSearchParam(key: string, navOptions?: NavigateOptions) {
      const search = new URLSearchParams(location.search);
      search.delete(key);
      nav(`${location.pathname}?${search.toString()}`, navOptions);
    },
  };
}
