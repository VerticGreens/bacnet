const expect = require("chai").expect;
const utils = require("./utils");
const baEnum = require("../../lib/enum");

describe("bacnet - unconfirmedCOVNotification integration", () => {
  it("should correctly send a telegram", () => {
    const client = new utils.bacnetClient({ apduTimeout: 200 });
    client.unconfirmedCOVNotification(
      "127.0.0.2",
      3,
      433,
      { type: 2, instance: 122 },
      120,
      [
        {
          property: { id: 85 },
          value: [{ type: baEnum.ApplicationTag.REAL, value: 12.3 }],
        },
        {
          property: { id: 111 },
          value: [{ type: baEnum.ApplicationTag.BIT_STRING, value: 0xffff }],
        },
      ]
    );
    client.close();
  });
});
