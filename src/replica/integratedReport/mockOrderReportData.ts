export type OrderReportRow = {
  orderNo: string;
  email: string;
  username: string;
  phone: string;
  realUsername: string;
  orderTime: string;
  payTime: string;
};

export const ORDER_REPORT_ROWS: OrderReportRow[] = [
  {
    orderNo: "ORD20250525001",
    email: "user001@example.com",
    username: "zhangsan",
    phone: "13800138001",
    realUsername: "张三",
    orderTime: "2025-05-24 14:32:18",
    payTime: "2025-05-24 14:35:02",
  },
  {
    orderNo: "ORD20250525002",
    email: "user002@example.com",
    username: "lisi",
    phone: "13900139002",
    realUsername: "李四",
    orderTime: "2025-05-25 09:15:44",
    payTime: "2025-05-25 09:16:30",
  },
];

export const ORDER_REPORT_TOTAL = ORDER_REPORT_ROWS.length;

export const ORDER_REPORT_COLUMNS = [
  { key: "orderNo", label: "订单号" },
  { key: "email", label: "邮件账号" },
  { key: "username", label: "用户名" },
  { key: "phone", label: "电话" },
  { key: "realUsername", label: "真实用户名" },
  { key: "orderTime", label: "下单时间" },
  { key: "payTime", label: "支付时间" },
] as const;
