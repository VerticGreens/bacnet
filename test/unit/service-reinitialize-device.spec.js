const expect = require("chai").expect;
const utils = require("./utils");
const baServices = require("../../libjs/services");

describe("bacnet - Services layer ReinitializeDevice unit", () => {
  it("should successfully encode and decode", () => {
    const buffer = utils.getBuffer();
    baServices.reinitializeDevice.encode(buffer, 5);
    const result = baServices.reinitializeDevice.decode(
      buffer.buffer,
      0,
      buffer.offset
    );
    delete result.len;
    expect(result).to.deep.equal({
      state: 5,
    });
  });

  it("should successfully encode and decode with password", () => {
    const buffer = utils.getBuffer();
    baServices.reinitializeDevice.encode(buffer, 5, "Test1234$");
    const result = baServices.reinitializeDevice.decode(
      buffer.buffer,
      0,
      buffer.offset
    );
    delete result.len;
    expect(result).to.deep.equal({
      state: 5,
      password: "Test1234$",
    });
  });
});
