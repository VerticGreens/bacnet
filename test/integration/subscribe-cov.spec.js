const expect = require("chai").expect;
const utils = require("./utils");

describe("bacnet - subscribeCov integration", () => {
  it("should return a timeout error if no device is available", (next) => {
    const client = new utils.bacnetClient({ apduTimeout: 200 });
    client.subscribeCov(
      "127.0.0.2",
      { type: 5, instance: 3 },
      7,
      false,
      false,
      0,
      (err, value) => {
        expect(err.message).to.eql("ERR_TIMEOUT");
        expect(value).to.eql(undefined);
        client.close();
        next();
      }
    );
  });
});
