import '@testing-library/jest-dom';

if (typeof MessageChannel === 'undefined') {
  global.MessageChannel = class MessageChannel {
    port1 = { postMessage: () => {}, close: () => {} };
    port2 = { postMessage: () => {}, close: () => {} };
  };
}

global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  };
