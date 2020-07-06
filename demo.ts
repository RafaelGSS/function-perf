import { Measure } from './index';

class Employee {
  constructor(
    private firstName: string,
    private lastName: string,
  ) {}

  @Measure({
    asyncFunction: true,
    cb: (...args: any) => {
      debugger;
    }
  })
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
