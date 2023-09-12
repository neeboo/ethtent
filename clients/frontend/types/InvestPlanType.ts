export type InvestPlanType = {
  amount: number | string; //每轮定投金额
  revenue: string; //每轮定投收益
  currency: string; //币种
  total: number | string; //总收益
  date: number | string; //日期
  gainLoss: number | string;
  tx_hash?: string;
  intent_id?: string; //盈亏
};
