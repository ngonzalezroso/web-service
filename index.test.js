jest.mock('./config.js', () => ({
  TOP_ARRAY_LENGTH: 5
}));

const sorting = require('./index');

describe('Test request handling', () => {
  afterEach(() => {
    sorting.clear();
  });

  it('Returns empty array when no requests have been handled', () => {
    const top = sorting.top100();

    expect(top).toStrictEqual([]);
  })

  it('Returns the correct TOP Ips', () => {
    for(let i = 0; i < 20; i++) {
      const ip = `${i}.${i}.${i}`;
      for (let j = 0; j <= i; j++) {
        sorting.request_handled(ip);
      }
    }

    const top = sorting.top100();

    let expectedArray = [];
    for(let i = 19; i >= 15; i--) {
      const ip = `${i}.${i}.${i}`;
      expectedArray.push(ip);
    }

    expect(top).toStrictEqual(expectedArray);
    console.log(top);
  });

  it("Returns the correct Ip when it's only one", () => {
    const ip1 = '1.1.1';
    const ip2 = '1.1.1';

    sorting.request_handled(ip1);
    sorting.request_handled(ip2);

    const top = sorting.top100();
    expect(top).toStrictEqual([ip1]);
  })
})