import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { Measure } from '../src/mod.ts';

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
      assert.strictEqual(typeof measure, 'function');
    });

    it('should replace the descriptor.value with sync function', () => {
      assert.strictEqual(typeof descriptor.value, 'function');
      assert.ok(descriptor.value() instanceof Number);
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
      assert.strictEqual(typeof measure, 'function');
    });

    it('should replace the descriptor.value with async function', () => {
      assert.strictEqual(typeof descriptor.value, 'function');
      assert.ok(descriptor.value() instanceof Promise);
    });
  });

  describe('with callback use', () => {
    let descriptor: any;
    let measure: any;
    let callback: ReturnType<typeof mock.fn>;

    beforeEach(() => {
      descriptor = { value: () => new Number(1) }; // Original method returns a Number instance
      callback = mock.fn();
      measure = Measure({ cb: callback });
      measure({}, 'example key', descriptor);
    });

    it('should return function', () => {
      assert.strictEqual(typeof measure, 'function');
    });

    it('should replace the descriptor.value with sync function that preserves return type', () => {
      assert.strictEqual(typeof descriptor.value, 'function');
      const result = descriptor.value();
      assert.ok(result instanceof Number, 'Decorated method should return a Number instance');
      assert.strictEqual(result.valueOf(), 1, 'Decorated method should return the original value');
    });

    it('should call the callback', async () => {
      descriptor.value(); // Call the decorated method
      await new Promise(resolve => setImmediate(resolve)); // Allow next tick for callback
      assert.strictEqual(callback.mock.calls.length, 1);
      // Assuming cb is called with one argument: PerformanceEntryList (or an array of PerformanceEntry)
      const [perfEntries] = callback.mock.calls[0].arguments;
      assert.ok(perfEntries && typeof perfEntries.length === 'number', 'perfEntries should be an array-like object');
      assert.strictEqual(perfEntries.length, 1);
      const measureEntry = perfEntries[0];
      assert.strictEqual(measureEntry.entryType, 'measure');
      assert.strictEqual(measureEntry.name, 'example key');
      assert.ok(typeof measureEntry.duration === 'number');
      assert.ok(measureEntry.duration >= 0, 'Duration should be non-negative');
      assert.ok(typeof measureEntry.startTime === 'number');
    });
  });

  describe('with async: true and callback use', () => {
    let descriptor: any;
    let measure: any;
    let callback: any;

    beforeEach(async () => {
      // Original method is async and returns a Promise resolving to a Number instance
      descriptor = { value: async () => new Number(42) };
      callback = mock.fn();
      measure = Measure({ asyncFunction: true, cb: callback });
      measure({}, 'example async key with cb', descriptor);
    });

    it('should return function', () => {
      assert.strictEqual(typeof measure, 'function');
    });

    it('should replace the descriptor.value with async function', async () => {
      assert.strictEqual(typeof descriptor.value, 'function');
      const promise = descriptor.value();
      assert.ok(promise instanceof Promise, 'Decorated method should return a Promise');
      const result = await promise;
      assert.ok(result instanceof Number, 'Promise should resolve to a Number instance');
      assert.strictEqual(result.valueOf(), 42, 'Promise should resolve to the original value');
    });

    it('should call the callback after promise resolution', async () => {
      await descriptor.value(); // Call the decorated async method
      await new Promise(resolve => setImmediate(resolve)); // Allow next tick for callback
      assert.strictEqual(callback.mock.calls.length, 1);
      const [perfEntries] = callback.mock.calls[0].arguments;
      assert.ok(perfEntries && typeof perfEntries.length === 'number', 'perfEntries should be an array-like object');
      assert.strictEqual(perfEntries.length, 1);
      const measureEntry = perfEntries[0];
      assert.strictEqual(measureEntry.entryType, 'measure');
      assert.match(measureEntry.name, /example async key with cb-/);
      assert.ok(typeof measureEntry.duration === 'number');
      assert.ok(measureEntry.duration >= 0, 'Duration should be non-negative');
      assert.ok(typeof measureEntry.startTime === 'number');
    });

    it('should preserve the original async method\'s return value', async () => {
      const expectedResult = 'async test result value';
      descriptor = { value: async () => expectedResult };
      callback = mock.fn();
      measure = Measure({ asyncFunction: true, cb: callback });
      measure({}, 'async return value test', descriptor);

      const actualResult = await descriptor.value();
      await new Promise(resolve => setImmediate(resolve)); // Allow next tick for callback
      assert.strictEqual(actualResult, expectedResult);
      assert.strictEqual(callback.mock.calls.length, 1, 'Callback should be called once');
    });
  });
});
