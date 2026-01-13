import '@testing-library/jest-dom';

if (typeof MessageChannel === 'undefined') {
  global.MessageChannel = class MessageChannel {
    port1 = { postMessage: () => {}, close: () => {} };
    port2 = { postMessage: () => {}, close: () => {} };
  };
}

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
