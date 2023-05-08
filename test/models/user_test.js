import User from "../../models/user.js";
import { expect } from "chai";
import { describe, it } from "mocha";

describe("User", () => {
  describe("#save()", () => {
    it("should save without error", (done) => {
      const user = new User({
        email: "john@example.com",
        password: "password",
      });

      user.save((err) => {
        expect(err).to.be.null;
        done(err);
      });
    });
  });
});
