export type OverviewCardData = {
  title: string;
  value: string;
  rate: string;
  rateType: "up" | "down" | "neutral";
  desc: string;
};

export const overviewCards: OverviewCardData[] = [
  { title: "今日视频调用", value: "12,843", rate: "12.5%", rateType: "up", desc: "较昨日" },
  { title: "今日视频成功", value: "12,521", rate: "97.5%", rateType: "up", desc: "成功率" },
  { title: "今日视频失败", value: "322", rate: "2.5%", rateType: "down", desc: "失败率" },
  { title: "今日3D调用", value: "8,456", rate: "8.2%", rateType: "up", desc: "较昨日" },
  { title: "今日3D成功", value: "8,145", rate: "96.3%", rateType: "up", desc: "成功率" },
  { title: "今日3D失败", value: "311", rate: "3.7%", rateType: "down", desc: "失败率" },
];

export type CurrentTask = {
  key: string;
  taskId: string;
  type: string;
  user: string;
  progress: number;
  status: "运行中" | "排队中";
};

export const currentVideoTasks: CurrentTask[] = [
  { key: "1", taskId: "VID-20240615-001", type: "视频生成", user: "user_1254", progress: 75, status: "运行中" },
  { key: "2", taskId: "VID-20240615-002", type: "视频生成", user: "user_8752", progress: 32, status: "运行中" },
  { key: "3", taskId: "VID-20240615-003", type: "视频生成", user: "user_3641", progress: 90, status: "运行中" },
  { key: "4", taskId: "VID-20240615-004", type: "视频生成", user: "user_9512", progress: 15, status: "排队中" },
];

export const current3dTasks: CurrentTask[] = [
  { key: "1", taskId: "3D-20240615-001", type: "3D建模", user: "user_4312", progress: 64, status: "运行中" },
  { key: "2", taskId: "3D-20240615-002", type: "3D建模", user: "user_6488", progress: 48, status: "运行中" },
  { key: "3", taskId: "3D-20240615-003", type: "3D建模", user: "user_2206", progress: 88, status: "运行中" },
  { key: "4", taskId: "3D-20240615-004", type: "3D建模", user: "user_1964", progress: 20, status: "排队中" },
];

export const monthlyData = {
  xData: ["1日", "2日", "3日", "4日", "5日", "6日", "7日", "8日", "9日", "10日", "11日", "12日", "13日", "14日", "15日"],
  videoCalls: [420, 380, 450, 520, 480, 560, 620, 580, 650, 720, 680, 750, 820, 850, 880],
  videoRate: [95, 96, 94, 97, 96, 95, 98, 97, 96, 98, 97, 96, 98, 97, 98],
  calls3d: [280, 320, 300, 350, 380, 420, 400, 450, 480, 520, 500, 550, 580, 600, 620],
  rate3d: [94, 95, 93, 96, 95, 94, 97, 96, 95, 96, 95, 94, 96, 95, 96],
};

export const yearlyData = {
  xData: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  videoCalls: [5200, 5800, 6500, 7200, 7800, 8500, 9200, 9800, 10500, 11200, 12000, 12800],
  videoRate: [93, 94, 94, 95, 95, 96, 96, 97, 96, 97, 97, 98],
  calls3d: [3500, 4200, 4800, 5200, 5800, 6500, 7200, 7800, 8200, 8800, 9500, 10200],
  rate3d: [92, 92, 93, 93, 94, 94, 95, 95, 94, 95, 96, 96],
};

export type CallRecord = {
  key: string;
  taskId: string;
  type: string;
  userId: string;
  startTime: string;
  duration: number;
  status: "成功" | "失败";
};

export const callRecords: CallRecord[] = [
  { key: "1", taskId: "VID-20240614-1258", type: "视频生成", userId: "user_1254", startTime: "2024-06-14 18:24:36", duration: 12450, status: "成功" },
  { key: "2", taskId: "3D-20240614-1257", type: "3D建模", userId: "user_8752", startTime: "2024-06-14 18:22:15", duration: 8420, status: "成功" },
  { key: "3", taskId: "VID-20240614-1256", type: "视频生成", userId: "user_3641", startTime: "2024-06-14 18:20:45", duration: 15230, status: "失败" },
  { key: "4", taskId: "3D-20240614-1255", type: "3D建模", userId: "user_9512", startTime: "2024-06-14 18:18:32", duration: 6780, status: "成功" },
  { key: "5", taskId: "VID-20240614-1254", type: "视频生成", userId: "user_4587", startTime: "2024-06-14 18:15:10", duration: 11350, status: "成功" },
];
