const expect = require("chai").expect;
const utils = require("./utils");

describe("bacnet - subscribeProperty integration", () => {
  it("should return a timeout error if no device is available", (next) => {
    const client = new utils.bacnetClient({ apduTimeout: 200 });
    client.subscribeProperty(
      "127.0.0.2",
      { type: 5, instance: 33 },
      { id: 80, index: 0 },
      8,
      false,
      false,
      (err, value) => {
        expect(err.message).to.eql("ERR_TIMEOUT");
        expect(value).to.eql(undefined);
        client.close();
        next();
      }
    );
  });
});
