const expect = require("chai").expect;
const utils = require("./utils");

describe("bacnet - unconfirmedPrivateTransfer integration", () => {
  it("should correctly send a telegram", () => {
    const client = new utils.bacnetClient({ apduTimeout: 200 });
    client.unconfirmedPrivateTransfer(
      "127.0.0.2",
      0,
      7,
      [0x00, 0xaa, 0xfa, 0xb1, 0x00]
    );
    client.close();
  });
});
