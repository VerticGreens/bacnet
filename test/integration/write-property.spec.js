const expect = require("chai").expect;
const utils = require("./utils");

describe("bacnet - writeProperty integration", () => {
  it("should return a timeout error if no device is available", (next) => {
    const client = new utils.bacnetClient({ apduTimeout: 200 });
    client.writeProperty(
      "127.0.0.2",
      { type: 8, instance: 44301 },
      28,
      [{ type: 4, value: 100 }],
      (err, value) => {
        expect(err.message).to.eql("ERR_TIMEOUT");
        expect(value).to.eql(undefined);
        client.close();
        next();
      }
    );
  });
});
