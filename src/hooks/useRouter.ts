import { useMemo } from "react";
import {
  NavigateOptions,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

export default function useRouter<S extends { [k: string]: string }>() {
  const location = useLocation();
  const nav = useNavigate();
  const searchParams = useSearchParams();

  const searchParamsObj: S = useMemo(() => {
    return Object.fromEntries(new URLSearchParams(location.search)) as S;
  }, [location.search]);

  return {
    ...location,
    nav,
    searchParams,
    searchParamsObj,
    // 通过搜索参数导航
    navBySearchParam(
      key: string,
      value: string,
      navOptions?: NavigateOptions & { delOther?: boolean }
    ) {
      let _serach = location.search;
      if (navOptions?.delOther) {
        _serach = "";
      }
      const search = new URLSearchParams(_serach);
      search.set(key, value);
      nav(`${location.pathname}?${search.toString()}`, navOptions);
    },
    navByDelSearchParam(key: string, navOptions?: NavigateOptions) {
      const search = new URLSearchParams(location.search);
      search.delete(key);
      nav(`${location.pathname}?${search.toString()}`, navOptions);
    },
    delSearchParam(key: string) {
      const search = new URLSearchParams(location.search);
      search.delete(key);
      return `${location.pathname}?${search.toString()}`;
    },
  };
}
