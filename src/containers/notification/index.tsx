import { useEffect, useState } from 'react';
import axios from 'axios';
import { urlBase64ToUint8Array } from '@src/utils/push-utils';
import { BellOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import config from '@src/config';
import { API_ROUTES } from '@src/consts';

const Notification = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [publicKey, setPublicKey] = useState('');

  useEffect(() => {
    axios
      .get(`${config.api.baseUrl}/${API_ROUTES.NOTIFICATION}/vapid-public-key`)
      .then(({ data }) => setPublicKey(data.publicKey))
      .catch(console.error);

    (async () => {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    })();
  }, []);

  const subscribeToNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return alert('Push-уведомления не поддерживаются');
    }

    try {
      const registration = await navigator.serviceWorker.register('/notificationServiceWorker.js');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await axios.post(`${config.api.baseUrl}/${API_ROUTES.NOTIFICATION}/subscribe`, subscription);
      setIsSubscribed(true);
    } catch (error) {
      console.error(error);
    }
  };

  const unsubscribeFromNotifications = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      setIsSubscribed(false);
    }
  };

  return isSubscribed ? (
    <Tooltip placement="bottom" title="Вы подписаны на уведомления">
      <Button type="primary" shape="circle" icon={<BellOutlined />} onClick={unsubscribeFromNotifications} />
    </Tooltip>
  ) : (
    <Tooltip placement="bottom" title="Подписаться на уведомления">
      <Button shape="circle" icon={<BellOutlined />} onClick={subscribeToNotifications} />
    </Tooltip>
  );
};

export default Notification;
