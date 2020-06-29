import { performance, PerformanceObserver } from 'perf_hooks';

export type MeasureOpts = {
  asyncFunction?: boolean,
  cb: (entry: PerformanceEntry[]) => any;
};

const defaultLogResource = (entries: PerformanceEntry[]) => {
  console.log(`${entries[0].name} -> ${entries[0].duration}`)
};

export function Measure(opts?: MeasureOpts): any {
  const callback = opts?.cb || defaultLogResource;
  return function (_target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const method = descriptor.value;
    const obs = new PerformanceObserver((list) => {
      callback(list)
    });
    obs.observe({ entryTypes: ['measure'] });

    if (opts?.asyncFunction) {
      descriptor.value = async function (...args: any[]) {
        const id = new Date().getTime();
        performance.mark(`${propertyKey}-${id}-start`);
        const result = await method.apply(this, args);
        performance.mark(`${propertyKey}-${id}-end`);
        performance.measure(`${propertyKey}-${id}`, `${propertyKey}-${id}-start`, `${propertyKey}-${id}-end`);
        return result;
      }
    } else {
      descriptor.value = function (...args: any[]) {
        const id = new Date().getTime();
        performance.mark(`${propertyKey}-${id}-start`);
        const result = method.apply(this, args);
        performance.mark(`${propertyKey}-${id}-end`);
        performance.measure(`${propertyKey}`, `${propertyKey}-${id}-start`, `${propertyKey}-${id}-end`);
        return result;
      }
    }

    return descriptor;
  }
}

class Employee {
  constructor(
    private firstName: string,
    private lastName: string,
    private calls: number = 0,
  ) {}

  @Measure({ asyncFunction: true })
  async greet(message: string): Promise<string> {
    return `${this.firstName} ${this.lastName} says: ${message}`;
  }

  async greet2(message: string): Promise<string> {
    return `${this.firstName} ${this.lastName} says: ${message}`;
  }

}

async function main() {
  const emp = new Employee('Mohan Ram', 'Ratnakumar');

  console.time('greet')
  await emp.greet('hello');
  await emp.greet('hello');
  console.timeEnd('greet')

  console.time('greet2')
  await emp.greet2('hello');
  await emp.greet2('hello');
  console.timeEnd('greet2')
}

main()
