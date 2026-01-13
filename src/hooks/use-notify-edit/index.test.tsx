import { omit } from 'lodash';
import { Messages, useNotifyEdit } from '.';
import { renderHook, act } from '@testing-library/react';
import { useBroadcastChannel } from '@src/hooks/use-broadcast-channel';

jest.mock('@src/hooks/use-broadcast-channel');
jest.mock('lodash');

const mockUseBroadcastChannel = useBroadcastChannel as jest.MockedFunction<typeof useBroadcastChannel>;
const mockOmit = omit as jest.MockedFunction<typeof omit>;

describe('useNotifyEdit', () => {
  const mockPostMessage = jest.fn();
  const channelName = 'test';

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBroadcastChannel.mockReturnValue({
      postMessage: mockPostMessage,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Init state', () => {
    test('Дефолтное состояние', () => {
      const { result } = renderHook(() => useNotifyEdit(channelName));

      expect(result.current.editing).toBeNull();
      expect(result.current.ref.current).toBeNull();
      expect(typeof result.current.notifyStart).toBe('function');
      expect(typeof result.current.notifyEnd).toBe('function');
    });

    test('Корректные аргументы', () => {
      renderHook(() => useNotifyEdit(channelName));
      expect(mockUseBroadcastChannel).toHaveBeenCalledWith(channelName, expect.any(Function));
    });
  });

  describe('Отправка сообщений', () => {
    test('START', () => {
      const { result } = renderHook(() => useNotifyEdit(channelName));

      const messageHandler = mockUseBroadcastChannel.mock.calls[0][1];

      act(() => messageHandler?.({ type: Messages.START, id: 'id1' }));
      expect(result.current.editing).toEqual({ id1: 1 });

      act(() => messageHandler?.({ type: Messages.START, id: 'id1' }));
      expect(result.current.editing).toEqual({ id1: 2 });

      act(() => messageHandler?.({ type: Messages.START, id: 'id2' }));
      expect(result.current.editing).toEqual({ id1: 2, id2: 1 });
    });

    test('END', () => {
      const { result } = renderHook(() => useNotifyEdit(channelName));
      const messageHandler = mockUseBroadcastChannel.mock.calls[0][1];

      act(() => {
        messageHandler?.({ type: Messages.START, id: 'id1' });
        messageHandler?.({ type: Messages.START, id: 'id1' });
        messageHandler?.({ type: Messages.START, id: 'id2' });
      });

      expect(result.current.editing).toEqual({ id1: 2, id2: 1 });

      act(() => messageHandler?.({ type: 'END', id: 'id1' }));
      expect(result.current.editing).toEqual({ id1: 1, id2: 1 });

      act(() => messageHandler?.({ type: 'END', id: 'id1' }));
      expect(mockOmit).toHaveBeenCalledWith({ id1: 1, id2: 1 }, ['id1']);

      mockOmit.mockReturnValueOnce({ id2: 1 });
    });

    test('Удаление id', () => {
      const { result } = renderHook(() => useNotifyEdit(channelName));
      const messageHandler = mockUseBroadcastChannel.mock.calls[0][1];

      act(() => messageHandler?.({ type: Messages.START, id: 'id' }));
      expect(result.current.editing).toEqual({ id: 1 });

      act(() => messageHandler?.({ type: Messages.END, id: 'id' }));
      expect(mockOmit).toHaveBeenCalledWith({ id: 1 }, ['id']);
    });

    test('UNKNOWN', () => {
      const { result } = renderHook(() => useNotifyEdit(channelName));
      const messageHandler = mockUseBroadcastChannel.mock.calls[0][1];

      const initialState = result.current.editing;
      act(() => messageHandler?.({ type: 'UNKNOWN', id: 'id' }));

      expect(result.current.editing).toBe(initialState);
    });

    test('ref', () => {
      const { result } = renderHook(() => useNotifyEdit(channelName));

      expect(result.current.ref.current).toBeNull();

      act(() => (result.current.ref.current = 'id'));
      expect(result.current.ref.current).toBe('id');
    });
  });

  describe('notifyStart & notifyEnd', () => {
    test('START', () => {
      const { result } = renderHook(() => useNotifyEdit(channelName));

      act(() => result.current.notifyStart('id'));
      expect(mockPostMessage).toHaveBeenCalledWith({ type: Messages.START, id: 'id' });
    });

    test('END', () => {
      const { result } = renderHook(() => useNotifyEdit(channelName));

      act(() => result.current.notifyEnd('id'));
      expect(mockPostMessage).toHaveBeenCalledWith({ type: Messages.END, id: 'id' });
    });

    test('Мемоизация', () => {
      const { result, rerender } = renderHook(() => useNotifyEdit(channelName));

      const startNotifyStart = result.current.notifyStart;
      const startNotifyEnd = result.current.notifyEnd;

      rerender();

      expect(result.current.notifyStart).toBe(startNotifyStart);
      expect(result.current.notifyEnd).toBe(startNotifyEnd);
    });
  });

  describe('beforeunload', () => {
    let addEventListenerSpy: jest.SpyInstance;
    let removeEventListenerSpy: jest.SpyInstance;

    beforeEach(() => {
      addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    });

    afterEach(() => {
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    test('mount', () => {
      renderHook(() => useNotifyEdit(channelName));
      expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    });

    test('unmount', () => {
      renderHook(() => useNotifyEdit(channelName)).unmount();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    });

    test('notifyEnd - вызывается', () => {
      const { result } = renderHook(() => useNotifyEdit(channelName));

      act(() => (result.current.ref.current = 'id'));

      const beforeUnloadHandler = addEventListenerSpy.mock.calls.find(call => call[0] === 'beforeunload')?.[1];
      expect(beforeUnloadHandler).toBeDefined();

      beforeUnloadHandler?.();
      expect(mockPostMessage).toHaveBeenCalledWith({ type: Messages.END, id: 'id' });
    });

    test('notifyEnd - не вызывается', () => {
      const { result } = renderHook(() => useNotifyEdit(channelName));

      expect(result.current.ref.current).toBeNull();

      const beforeUnloadHandler = addEventListenerSpy.mock.calls.find(call => call[0] === 'beforeunload')?.[1];
      beforeUnloadHandler?.();

      expect(mockPostMessage).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    test('Несколько каналов', () => {
      const channel1 = 'channel1';
      const channel2 = 'channel2';

      const { result: result1 } = renderHook(() => useNotifyEdit(channel1));
      const { result: result2 } = renderHook(() => useNotifyEdit(channel2));

      expect(mockUseBroadcastChannel).toHaveBeenCalledTimes(2);
      expect(mockUseBroadcastChannel).toHaveBeenCalledWith(channel1, expect.any(Function));
      expect(mockUseBroadcastChannel).toHaveBeenCalledWith(channel2, expect.any(Function));

      const messageHandler1 = mockUseBroadcastChannel.mock.calls[0][1];

      act(() => messageHandler1?.({ type: Messages.START, id: 'id' }));

      expect(result1.current.editing).toEqual({ id: 1 });
      expect(result2.current.editing).toBeNull();
    });

    test('Разные postMessage', () => {
      const newPostMessage = jest.fn();
      mockUseBroadcastChannel.mockReturnValue({
        postMessage: newPostMessage,
      });

      const { result } = renderHook(() => useNotifyEdit(channelName));

      act(() => result.current.notifyStart('id'));
      expect(newPostMessage).toHaveBeenCalled();
    });
  });

  describe('Производительность', () => {
    test('Ререндер функций - новые не создаются', () => {
      const { result, rerender } = renderHook(() => useNotifyEdit(channelName));

      const initialNotifyStart = result.current.notifyStart;
      const initialNotifyEnd = result.current.notifyEnd;

      rerender();

      expect(result.current.notifyStart).toBe(initialNotifyStart);
      expect(result.current.notifyEnd).toBe(initialNotifyEnd);
    });
  });
});
