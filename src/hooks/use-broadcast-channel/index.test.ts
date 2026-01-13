import { renderHook, act } from '@testing-library/react';
import { useBroadcastChannel } from '.';

interface MockMessageEvent {
  data: unknown;
}

type EventListener = (event: MockMessageEvent) => void;

class MockBroadcastChannel {
  private name: string;
  private eventListeners: Map<string, EventListener[]>;

  constructor(name: string) {
    this.name = name;
    this.eventListeners = new Map();
  }

  addEventListener(event: string, listener: EventListener): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  removeEventListener(event: string, listener: EventListener): void {
    const listeners = this.eventListeners.get(event);
    if (!listeners) return;

    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  }

  postMessage(data: unknown): void {
    const listeners = this.eventListeners.get('message');
    listeners?.forEach(listener => listener({ data }));
  }

  close(): void {
    this.eventListeners.clear();
  }
}

const originalBroadcastChannel = global.BroadcastChannel;

describe('useBroadcastChannel', () => {
  describe('Основные', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).BroadcastChannel = MockBroadcastChannel;
    });

    afterEach(() => {
      global.BroadcastChannel = originalBroadcastChannel;
    });

    test('Создание канала', () => {
      const channelName = 'test';
      const { result } = renderHook(() => useBroadcastChannel(channelName));

      expect(result.current.postMessage).toBeDefined();
      expect(typeof result.current.postMessage).toBe('function');
    });

    test('Отправка сообщения', () => {
      const channelName = 'test';
      const mockPostMessage = jest.fn();

      const MockChannelWithSpy = class extends MockBroadcastChannel {
        postMessage = mockPostMessage;
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).BroadcastChannel = MockChannelWithSpy;

      const { result } = renderHook(() => useBroadcastChannel(channelName));
      const msg = 'test msg';

      result.current.postMessage(msg);
      expect(mockPostMessage).toHaveBeenCalledWith(msg);
    });

    test('Отправка сообщения в разные каналы', async () => {
      const channel1Name = 'test 1';
      const channel2Name = 'test 2';
      const mockPostMessage1 = jest.fn();
      const mockPostMessage2 = jest.fn();

      const MockChannel1 = class extends MockBroadcastChannel {
        postMessage = mockPostMessage1;
      };
      const MockChannel2 = class extends MockBroadcastChannel {
        postMessage = mockPostMessage2;
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).BroadcastChannel = MockChannel1;
      const { result: result1 } = renderHook(() => useBroadcastChannel(channel1Name, mockPostMessage1));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).BroadcastChannel = MockChannel2;
      const { result: result2 } = renderHook(() => useBroadcastChannel(channel2Name, mockPostMessage2));

      const msg1 = 'msg 1';
      const msg2 = 'msg 2';

      result1.current.postMessage(msg1);
      result2.current.postMessage(msg2);

      expect(mockPostMessage1).toHaveBeenCalledWith(msg1);
      expect(mockPostMessage2).toHaveBeenCalledWith(msg2);
    });

    test('Unmount - cleanup', () => {
      const channelName = 'test-channel';
      const handleMessage = jest.fn();
      const closeSpy = jest.fn();

      const MockChannel = class extends MockBroadcastChannel {
        close = closeSpy;
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).BroadcastChannel = MockChannel;

      const { unmount } = renderHook(() => useBroadcastChannel(channelName, handleMessage));
      unmount();

      expect(closeSpy).toHaveBeenCalled();
      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    test('Unmount - cleanup -> message', () => {
      const channelName = 'test';
      const { result, unmount } = renderHook(() => useBroadcastChannel(channelName));
      unmount();

      expect(() => result.current.postMessage('test')).not.toThrow();
    });

    test('Без onMessage', () => {
      const channelName = 'test-channel';

      const { result } = renderHook(() => useBroadcastChannel(channelName));

      expect(result.current.postMessage).toBeDefined();
      expect(() => result.current.postMessage('test')).not.toThrow();
    });

    test('Пустое название канала', () => {
      const channelName = '';
      const { result } = renderHook(() => useBroadcastChannel(channelName));

      expect(result.current.postMessage).toBeDefined();
      expect(() => result.current.postMessage('test')).not.toThrow();
    });

    test('Ререндер', () => {
      const channelName = 'test';

      const { result, rerender } = renderHook(({ name }: { name: string }) => useBroadcastChannel(name), {
        initialProps: { name: channelName },
      });

      const firstPostMessage = result.current.postMessage;
      rerender({ name: channelName });

      const secondPostMessage = result.current.postMessage;
      expect(firstPostMessage).toBe(secondPostMessage);
    });
  });

  describe('Интеграционные тесты', () => {
    test('Отправка сообщения в обе стороны', () => {
      class IntegrationBroadcastChannel {
        private static channels = new Map<string, Set<IntegrationBroadcastChannel>>();
        private listeners = new Set<(event: { data: unknown }) => void>();
        private name: string;

        constructor(name: string) {
          this.name = name;
          if (!IntegrationBroadcastChannel.channels.has(name)) {
            IntegrationBroadcastChannel.channels.set(name, new Set());
          }
          IntegrationBroadcastChannel.channels.get(name)!.add(this);
        }

        postMessage(data: unknown): void {
          const channels = IntegrationBroadcastChannel.channels.get(this.name);
          if (!channels) return;

          channels.forEach(channel => {
            if (channel !== this) {
              channel.listeners.forEach(listener => listener({ data }));
            }
          });
        }

        addEventListener(_: string, listener: (event: { data: unknown }) => void): void {
          this.listeners.add(listener);
        }

        removeEventListener(_: string, listener: (event: { data: unknown }) => void): void {
          this.listeners.delete(listener);
        }

        close(): void {
          const channels = IntegrationBroadcastChannel.channels.get(this.name);
          if (channels) channels.delete(this);
          this.listeners.clear();
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).BroadcastChannel = IntegrationBroadcastChannel;

      const channelName = 'test';

      const messages1: unknown[] = [];
      const messages2: unknown[] = [];

      const hook1 = renderHook(() => useBroadcastChannel(channelName, msg => messages1.push(msg)));
      const hook2 = renderHook(() => useBroadcastChannel(channelName, msg => messages2.push(msg)));

      const msg = 'test';
      hook1.result.current.postMessage(msg);

      expect(messages2).toEqual([msg]);
      expect(messages1).toEqual([]);

      messages2.length = 0;

      const msg2 = { id: 1, content: 'test' };
      hook2.result.current.postMessage(msg2);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).BroadcastChannel = originalBroadcastChannel;

      expect(messages1).toEqual([msg2]);
      expect(messages2).toEqual([]);
    });
  });
});
