import {PagingData} from '../../../../../app/pages/users/core/models';

export type NotificationQueryResponse = {
  status: string,
  data: Notification[],
  pagingData: PagingData,
};

export type Notification = {
  id: number,
  type: string,
  title: string,
  message: string,
  createdAt: string,
};
