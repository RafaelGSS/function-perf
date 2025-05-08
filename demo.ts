import { Measure, type MeasureOpts } from './src/mod.ts';

class Employee {
  constructor(
    private firstName: string,
    private lastName: string,
  ) {}

  // Original method, no decorator
  async greet(message: string): Promise<string> {
    // Simulate some async work for more noticeable duration
    // await new Promise(resolve => setTimeout(resolve, 10)); 
    return `${this.firstName} ${this.lastName} says: ${message}`;
  }

  async greet2(message: string): Promise<string> {
    // await new Promise(resolve => setTimeout(resolve, 10));
    return `${this.firstName} ${this.lastName} says: ${message}`;
  }
}

const emp = new Employee('Mohan Ram', 'Ratnakumar');

// --- Manual application of Measure to emp.greet ---

// 1. Options for Measure
const measureOpts: MeasureOpts = {
  asyncFunction: true,
  cb: (entries) => { // entries is PerformanceEntry[]
    if (entries && entries.length > 0) {
      // Log each measurement entry received by the callback
      entries.forEach(entry => {
        console.log(`Callback: Method '${entry.name}' took ${entry.duration.toFixed(4)}ms`);
      });
    } else {
      console.log('Callback: Received no performance entries.');
    }
  }
};

// 2. Get the original method from the instance (or prototype).
//    We'll modify the method on the instance `emp`.
const originalMethod = emp.greet;

// 3. Create a property descriptor for this method.
//    The decorator normally operates on a descriptor.
const descriptor: PropertyDescriptor = {
  value: originalMethod,
  writable: true,
  enumerable: true, // Assuming instance methods are enumerable, or adjust as needed
  configurable: true
};

// 4. Get the "decorator" function from Measure
const measureDecorator = Measure(measureOpts);

// 5. Apply it.
//    _target: The object on which the method exists (emp instance).
//    propertyKey: The name of the method.
//    This call modifies descriptor.value to be the wrapped function.
measureDecorator(emp, 'greet', descriptor);

// 6. Replace the method on the instance with the wrapped one.
//    The `this` context within the wrapped function will be correctly set to `emp`
//    when `emp.greet()` is called.
emp.greet = descriptor.value;

// --- End of manual application ---

console.log("Calling manually 'measured' greet method:");
console.time('Total time for measured greet calls');
const result1 = await emp.greet('hello');
console.log(`Greet call 1 result: ${result1}`);
const result2 = await emp.greet('hello again');
console.log(`Greet call 2 result: ${result2}`);
console.timeEnd('Total time for measured greet calls');

console.log("\nCalling original greet2 method (for comparison):");
console.time('Total time for greet2 calls');
const result3 = await emp.greet2('hello');
console.log(`Greet2 call 1 result: ${result3}`);
const result4 = await emp.greet2('hello again');
console.log(`Greet2 call 2 result: ${result4}`);
console.timeEnd('Total time for greet2 calls');
