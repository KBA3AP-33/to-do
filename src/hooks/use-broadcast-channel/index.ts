import { useCallback, useEffect, useRef } from 'react';

export const useBroadcastChannel = (channelName: string, onMessage?: (data: MessageEvent['data']) => void) => {
  const channelRef = useRef<BroadcastChannel>(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const broadcastChannel = new BroadcastChannel(channelName);
    channelRef.current = broadcastChannel;

    const handleMessage = (event: MessageEvent) => {
      if (onMessageRef.current) {
        onMessageRef.current(event.data);
      }
    };

    broadcastChannel.addEventListener('message', handleMessage);

    return () => {
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleMessage);
        broadcastChannel.close();
      }
    };
  }, [channelName]);

  const postMessage = useCallback((message: unknown) => {
    channelRef.current?.postMessage(message);
  }, []);

  return { postMessage };
};
