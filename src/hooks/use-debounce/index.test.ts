import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '.';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('Должен отрендериться с начальным состоянием', () => {
    const initialValue = 'init';
    const { result } = renderHook(() => useDebounce(initialValue));

    expect(result.current.value).toBe(initialValue);
    expect(typeof result.current.onChange).toBe('function');
  });

  test('Должен сразу обновиться', () => {
    const onChangeMock = jest.fn();
    const { result } = renderHook(() => useDebounce('', onChangeMock));

    const mockEvent = {
      target: { value: 'value' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => result.current.onChange(mockEvent));

    expect(result.current.value).toBe('value');
    expect(onChangeMock).not.toHaveBeenCalled();
  });

  test('Должен обновиться с задержкой', () => {
    const onChangeMock = jest.fn();
    const { result } = renderHook(() => useDebounce('', onChangeMock, 500));

    const mockEvent = {
      target: { value: 'test' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => result.current.onChange(mockEvent));
    expect(onChangeMock).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(499));
    expect(onChangeMock).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(1));

    expect(onChangeMock).toHaveBeenCalledWith('test');
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  test('Должен сбрасывать прошлый таймер', () => {
    const onChangeMock = jest.fn();
    const { result } = renderHook(() => useDebounce('', onChangeMock, 500));

    act(() => {
      result.current.onChange({
        target: { value: '1' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => jest.advanceTimersByTime(300));
    act(() => {
      result.current.onChange({
        target: { value: '2' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => jest.advanceTimersByTime(200));
    expect(onChangeMock).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(300));

    expect(onChangeMock).toHaveBeenCalledWith('2');
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  test('Должен работать с разной задержкой', () => {
    const onChangeMock = jest.fn();
    const { result, rerender } = renderHook(({ delay }) => useDebounce('', onChangeMock, delay), {
      initialProps: { delay: 1000 },
    });

    act(() => {
      result.current.onChange({
        target: { value: 'test' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => jest.advanceTimersByTime(500));
    expect(onChangeMock).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(500));
    expect(onChangeMock).toHaveBeenCalledWith('test');

    onChangeMock.mockClear();

    rerender({ delay: 200 });

    act(() => {
      result.current.onChange({
        target: { value: 'test2' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => jest.advanceTimersByTime(200));

    expect(onChangeMock).toHaveBeenCalledWith('test2');
  });

  test('Должен работать с быстрым вводом', () => {
    const onChangeMock = jest.fn();
    const { result } = renderHook(() => useDebounce('', onChangeMock, 300));

    const inputs = ['a', 'ab', 'abc', 'abcd'];

    inputs.forEach((value, index) => {
      act(() => {
        result.current.onChange({
          target: { value },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      if (index < inputs.length - 1) {
        act(() => {
          jest.advanceTimersByTime(100);
        });
      }
    });

    expect(onChangeMock).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(300));

    expect(onChangeMock).toHaveBeenCalledWith('abcd');
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });
});
