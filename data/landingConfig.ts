// Landing page 静态展示配置 —— 不依赖 localStorage / 用户数据
export type LandingMemory = {
  city: string;
  date: string; // "YYYY.MM.DD"
  text: string;
};

export type LandingConfig = {
  coupleNames: [string, string];
  anniversaryDate: string;
  anniversaryLabel: string;
  /** 项目 province.id（见 data/provinces.ts） */
  litProvinceIds: string[];
  litCityCount: number;
  memories: LandingMemory[];
};

export const LANDING_CONFIG: LandingConfig = {
  coupleNames: ["阿楠", "阿鹿"],
  anniversaryDate: "2025.08.16",
  anniversaryLabel: "我们在一起",
  litProvinceIds: [
    "beijing",
    "shanghai",
    "zhejiang",
    "guangdong",
    "sichuan",
  ],
  litCityCount: 12,
  memories: [
    {
      city: "杭州",
      date: "2025.04.12",
      text: "西湖边的柳树刚发芽，买了第一杯龙井奶茶。",
    },
    {
      city: "上海",
      date: "2025.05.20",
      text: "外滩的灯光亮了，你说以后每年都要来一次。",
    },
    {
      city: "成都",
      date: "2025.07.08",
      text: "宽窄巷子吃了一整条街，辣到说不出话。",
    },
  ],
};