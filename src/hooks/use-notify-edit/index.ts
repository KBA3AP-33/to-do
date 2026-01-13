import { useBroadcastChannel } from '@src/hooks/use-broadcast-channel';
import { useCallback, useEffect, useRef, useState } from 'react';
import { omit } from 'lodash';

export enum Messages {
  START = 'START',
  END = 'END',
}

export const useNotifyEdit = (channelName: string) => {
  const [editing, setEditing] = useState<Record<string, number> | null>(null);
  const ref = useRef<string | null>(null);

  const { postMessage } = useBroadcastChannel(channelName, ({ type, id }) => {
    if (type === Messages.START) {
      setEditing(prev => ({ ...prev, [id]: (prev?.[id] ?? 0) + 1 }));
    }

    if (type === Messages.END) {
      setEditing(prev => {
        const value = (prev?.[id] ?? 0) - 1;
        return value < 1 ? omit(prev, [id]) : { ...prev, [id]: value };
      });
    }
  });

  const notifyStart = useCallback(
    (id: string) => {
      postMessage({ type: Messages.START, id });
    },
    [postMessage]
  );

  const notifyEnd = useCallback(
    (id: string) => {
      postMessage({ type: Messages.END, id });
    },
    [postMessage]
  );

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (ref.current) {
        notifyEnd(ref.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [notifyEnd]);

  return { editing, ref, notifyStart, notifyEnd };
};
