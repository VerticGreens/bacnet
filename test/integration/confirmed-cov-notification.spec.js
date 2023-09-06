const expect = require("chai").expect;
const utils = require("./utils");
const baEnum = require("../../lib/enum");

describe("bacnet - confirmedCOVNotification integration", () => {
  it("should return a timeout error if no device is available", (next) => {
    const client = new utils.bacnetClient({ apduTimeout: 200 });
    client.confirmedCOVNotification(
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
      ],
      (err, value) => {
        expect(err.message).to.eql("ERR_TIMEOUT");
        expect(value).to.eql(undefined);
        client.close();
        next();
      }
    );
  });
});
