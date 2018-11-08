import { notification } from 'antd';

export const showNotification = ({
  title,
  message = '',
  type = 'info',
  placement = 'topRight',
}) => {
  notification[type]({
    message: title,
    description: message,
    placement,
  });
};
