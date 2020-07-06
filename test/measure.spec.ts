import { Measure } from '..';

describe('Measure', () => {
  let measure: any;
  beforeEach(() => {
    measure = Measure();
  });

  it('epext', () => {
    expect(measure).toBeInstanceOf(Function);
  })
});
