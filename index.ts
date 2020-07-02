import { performance, PerformanceObserver, PerformanceEntry } from 'perf_hooks';

export type MeasureOpts = {
  asyncFunction?: boolean,
  cb?: (entry: PerformanceEntry[]) => any;
};

const defaultLogResource = (entries: PerformanceEntry[]) => {
  console.log(`${entries[0].name} -> ${entries[0].duration}`)
};

export function Measure(opts?: MeasureOpts): any {
  const callback = opts?.cb || defaultLogResource;
  return function (_target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    let thisFunc: object;
    const method = descriptor.value;
    const obs = new PerformanceObserver((list) => {
      callback.apply(thisFunc, [list.getEntries()]);
    });
    obs.observe({ entryTypes: ['measure'] });

    if (opts?.asyncFunction) {
      descriptor.value = async function (...args: any[]) {
        if (!thisFunc) { thisFunc = this; }
        const id = new Date().getTime();
        performance.mark(`${propertyKey}-${id}-start`);
        const result = await method.apply(this, args);
        performance.mark(`${propertyKey}-${id}-end`);
        performance.measure(`${propertyKey}-${id}`, `${propertyKey}-${id}-start`, `${propertyKey}-${id}-end`);
        return result;
      }
    } else {
      descriptor.value = function (...args: any[]) {
        if (!thisFunc) { thisFunc = this; }
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
