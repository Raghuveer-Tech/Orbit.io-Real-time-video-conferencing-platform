import test from "node:test";
import assert from "node:assert/strict";
import { signJwt, verifyJwt } from "../src/utils/jwt.js";

test("signJwt and verifyJwt work for a valid payload", () => {
  const token = signJwt({ username: "alice" }, "1h");
  const payload = verifyJwt(token);

  assert.equal(payload.username, "alice");
  assert.ok(payload.exp > Date.now() / 1000);
});

test("verifyJwt rejects a tampered token", () => {
  const token = signJwt({ username: "alice" }, "1h");
  const tampered = `${token.slice(0, -2)}x`;

  assert.throws(() => verifyJwt(tampered), /Invalid or expired token/i);
});
