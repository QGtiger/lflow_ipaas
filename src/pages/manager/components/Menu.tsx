import {
  ClusterOutlined,
  ContactsOutlined,
  FunctionOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import type { GetProp, MenuProps } from "antd";
import { ManagerModel } from "../model";
import { useLocation, useNavigate } from "react-router-dom";

type MenuItem = GetProp<MenuProps, "items">[number];

const MyMenu: React.FC = () => {
  const { connectorCode } = ManagerModel.useModel();
  const nav = useNavigate();
  const pathname = useLocation().pathname;
  const items: MenuItem[] = [
    {
      key: `/manager/${connectorCode}/base`,
      icon: <ContactsOutlined />,
      label: "基本信息",
    },
    {
      key: `/manager/${connectorCode}/auth`,
      icon: <SafetyOutlined />,
      label: "授权配置",
    },
    {
      key: `/manager/${connectorCode}/publish`,
      icon: <ClusterOutlined />,
      label: "应用发布",
    },
    {
      key: "/action",
      label: "执行操作",
      icon: <FunctionOutlined />,
      children: [
        { key: "7", label: "Option 7" },
        { key: "8", label: "Option 8" },
        { key: "9", label: "Option 9" },
        { key: "10", label: "Option 10" },
      ],
    },
  ];

  return (
    <Menu
      selectedKeys={[pathname]}
      items={items}
      mode="horizontal"
      onClick={(e) => nav(e.key as string)}
    />
  );
};

export default MyMenu;
