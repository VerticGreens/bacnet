const expect = require("chai").expect;
const utils = require("./utils");

describe("bacnet - readRange integration", () => {
  it("should return a timeout error if no device is available", (next) => {
    const client = new utils.bacnetClient({ apduTimeout: 200 });
    client.readRange(
      "127.0.0.2",
      { type: 20, instance: 0 },
      0,
      200,
      (err, value) => {
        expect(err.message).to.eql("ERR_TIMEOUT");
        expect(value).to.eql(undefined);
        client.close();
        next();
      }
    );
  });
});
