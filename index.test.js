jest.mock('./config.js', () => ({
  // simplify tests with a smaller array
  TOP_ARRAY_LENGTH: 5
}));

import { top100, request_handled, clear } from './index';

describe('Test request handling', () => {
  afterEach(() => {
    clear();
  });

  it('Returns empty array when no requests have been handled', () => {
    const top = top100();

    expect(top).toStrictEqual([]);
  })

  it('Returns the correct TOP Ips', () => {
    for(let i = 0; i < 20; i++) {
      const ip = `${i}.${i}.${i}`;
      for (let j = 0; j <= i; j++) {
        request_handled(ip);
      }
    }

    const top = top100();

    let expectedArray = [];
    for(let i = 19; i >= 15; i--) {
      const ip = `${i}.${i}.${i}`;
      expectedArray.push(ip);
    }

    expect(top).toStrictEqual(expectedArray);
  });

  it("Returns the correct Ip when it's only one", () => {
    const ip1 = '1.1.1';
    const ip2 = '1.1.1';
    request_handled(ip1);
    request_handled(ip2);

    const top = top100();
    expect(top).toStrictEqual([ip1]);
  });

  it('Works "fast" event with a large amount of numbers', () => {
    // the reason why it's slow is that I can't configure how much RAM/Processor to assign
    const dateBefore = new Date();
    for(let i = 0; i < 20000; i++) {
      const ip = `${i}.${i}.${i}`;
      for (let j = 0; j <= i; j++) {
        request_handled(ip);
      }
    }
    const dateAfter = new Date();
    const diff = dateAfter.getTime() - dateBefore.getTime();
    console.log('Diff =>', diff); // ~ 2 min
    expect(diff).toBeLessThanOrEqual(1000000);
  })
});
