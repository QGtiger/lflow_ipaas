import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import ReactDOM from "react-dom/client";
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import CommonLayout from "./components/CommonLayout";
import { layoutMap, notFoundMap, routeMap } from "./glob";

import "./index.css";

type ReactFunctionComponent = (props: any) => JSX.Element | null;

const handlePath = (path: string) => {
  return path.replace(/\[(.*?)\]/g, ":$1");
};

// 生成组件
function generateComp(ModuleComp: ReactFunctionComponent = CommonLayout) {
  return ModuleComp;
}

function initRoutes() {
  const resultRoutes: RouteObject[] = [];

  /**
   * 创建路由
   * @param pageUrl 页面路径
   * @param layoutUrl 布局页面路径
   * @param path 路径
   * @param routes 路由集合
   * @returns
   */
  function createRoute(
    relativePath: string,
    path: string,
    routes: RouteObject[] = []
  ) {
    const pageUrl = `${relativePath}/index.tsx`;
    const layoutUrl = `${relativePath}/layout.tsx`;
    const notFoundUrl = `${relativePath}/notFound.tsx`;

    const LayoutComp = generateComp(layoutMap[layoutUrl]?.default);
    // 页面 settings
    const PageComp = generateComp(routeMap[pageUrl]?.default);
    const NotFoundComp = notFoundMap[notFoundUrl]?.default;

    let route = routes.find((item) => item.path === handlePath(path));
    if (!route) {
      route = {
        path: handlePath(path),
        element: <LayoutComp />,
        children: [
          {
            index: true,
            element: PageComp ? <PageComp /> : null,
          },
        ],
      };

      // 路由器404
      if (NotFoundComp) {
        route.children!.push({
          path: "*",
          element: <NotFoundComp />,
        });
      }
      routes.unshift(route);
    }

    return route;
  }

  const rootRoute = createRoute(`./pages`, "", resultRoutes);

  function dfs(prePath: string, paths: string[], result: RouteObject[] = []) {
    if (!paths.length) return result;
    const path = paths.shift() || "";

    dfs(
      `${prePath}/${path}`,
      paths,
      createRoute(`${prePath}/${path}`, path, result).children
    );
    return result;
  }

  Object.keys(routeMap)
    .filter((key) => !key.includes("components"))
    .forEach((key) => {
      dfs("./pages", key.split("/").slice(2, -1), rootRoute.children);
    });

  return resultRoutes;
}

const routes = initRoutes();

const router = createBrowserRouter(routes);
console.log(routes);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ConfigProvider prefixCls="lflow">
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ConfigProvider>
);
