import { Measure } from '../index';

describe('Measure', () => {
  describe('no args', () => {
    let descriptor: any;
    let measure: any;

    beforeEach(() => {
      descriptor = { value: () => new Number(1) };
      measure = Measure();
      measure({}, 'example key', descriptor);
    });

    it('should return function', () => {
      expect(measure).toBeInstanceOf(Function);
    });

    it('should replace the descriptor.value with sync function', () => {
      expect(descriptor.value).toBeInstanceOf(Function);
      expect(descriptor.value()).toBeInstanceOf(Number);
    });
  });

  describe('with async: true', () => {
    let descriptor: any;
    let measure: any;

    beforeEach(() => {
      descriptor = { value: () => new Number(1) };
      measure = Measure({ asyncFunction: true });
      measure({}, 'example key', descriptor);
    });

    it('should return function', () => {
      expect(measure).toBeInstanceOf(Function);
    });

    it('should replace the descriptor.value with async function', () => {
      expect(descriptor.value).toBeInstanceOf(Function);
      expect(descriptor.value()).toBeInstanceOf(Promise);
    });
  });

  describe('with callback use', () => {
    let descriptor: any;
    let measure: any;
    let callback: any;

    beforeEach(() => {
      descriptor = { value: () => new Number(1) };
      callback = jest.fn();
      measure = Measure({ cb: callback });
      measure({}, 'example key', descriptor);
      descriptor.value();
    });

    it('should return function', () => {
      expect(measure).toBeInstanceOf(Function);
    });

    it('should replace the descriptor.value with sync function', () => {
      expect(descriptor.value).toBeInstanceOf(Function);
      expect(descriptor.value()).toBeInstanceOf(Number);
    });

    it('should call the callback', () => {
      expect(callback).toHaveBeenCalledWith([
        expect.objectContaining({
          duration: expect.any(Number),
          entryType: 'measure',
          name: 'example key',
          startTime: expect.any(Number),
        }),
      ]);
    });
  });
});
