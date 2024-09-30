export type LocationStatisticQueryResponse = {
  status: string;
  data: LocationStatisticalData[];
};

export type LocationStatisticalData = {
  date: string;
  count: number;
  formType: string;
}

export type StatisticQueryResponse = {
  status: string;
  patientData: StatisticData[];
  inventoryData: StatisticData[];
}

export type StatisticData = {
  createdAt: string;
  count: number;
}
