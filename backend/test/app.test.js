import assert from "node:assert/strict";
import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { after, before, test } from "node:test";
import jwt from "jsonwebtoken";
import { chooseSpies } from "../src/services/spySelection.js";

// These checks never connect to the real database or use deployment secrets.
process.env.DATABASE_URL = "http://127.0.0.1:1";
process.env.SUPABASE_SERVICE_KEY = "test-only-service-key";
process.env.SUPER_KEY = "test-only-jwt-secret";
process.env.PROD_URL = "https://example.test";

const { default: app } = await import("../src/app.js");
let server;
let baseUrl;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
});

test("protected endpoints retain their authentication responses", async () => {
  const endpoints = [
    ["GET", "/api/dashboard"], ["GET", "/api/users"],
    ["POST", "/api/add-word"], ["GET", "/api/custom"],
    ["POST", "/api/delete-word"], ["GET", "/api/words"],
    ["GET", "/api/lobby"], ["POST", "/api/game-start"],
    ["POST", "/api/update-role"], ["GET", "/api/get-results"],
    ["POST", "/api/reset-lobby"],
  ];
  for (const [method, url] of endpoints) {
    const missing = await fetch(baseUrl + url, { method });
    assert.equal(missing.status, 401, url);
    assert.deepEqual(await missing.json(), { error: "Unauthorized" });
    const invalid = await fetch(baseUrl + url, { method, headers: { Cookie: "token=invalid" } });
    assert.equal(invalid.status, 403, url);
    assert.deepEqual(await invalid.json(), { error: "Invalid token" });
  }
});

test("dashboard preserves JWT identity, CORS, and security headers", async () => {
  const token = jwt.sign({ id: 1, username: "test-player" }, process.env.SUPER_KEY);
  const response = await fetch(baseUrl + "/api/dashboard", {
    headers: { Cookie: `token=${token}`, Origin: process.env.PROD_URL },
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { user: "test-player" });
  assert.equal(response.headers.get("access-control-allow-origin"), process.env.PROD_URL);
  assert.equal(response.headers.get("access-control-allow-credentials"), "true");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.match(response.headers.get("permissions-policy"), /camera=\(\)/);
});

test("logout retains the response and secure expired cookie", async () => {
  const response = await fetch(baseUrl + "/api/logout", { method: "POST" });
  assert.deepEqual(await response.json(), { status: "not" });
  const cookie = response.headers.get("set-cookie");
  for (const fragment of ["token=;", "HttpOnly", "Secure", "SameSite=Strict", "Expires=Thu, 01 Jan 1970"]) {
    assert.ok(cookie.includes(fragment), fragment);
  }
});

test("public files resolve from the original frontend directory", async () => {
  for (const name of ["robots.txt", "sitemap.xml"]) {
    const response = await fetch(`${baseUrl}/${name}`);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), await readFile(new URL(`../../frontend/public/${name}`, import.meta.url), "utf8"));
  }
});

test("SPA fallback serves the built frontend for client routes", async t => {
  let html;
  try {
    html = await readFile(new URL("../../frontend/dist/index.html", import.meta.url), "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    t.skip("Run npm --prefix frontend run build to check the SPA fallback");
    return;
  }
  const response = await fetch(baseUrl + "/game-settings");
  assert.equal(response.status, 200);
  assert.equal(await response.text(), html);
});

test("spy selection remains unique and respects player and spy counts", () => {
  assert.deepEqual(chooseSpies([], 3, {}), []);
  assert.deepEqual(chooseSpies(["one"], 0, {}), []);
  assert.deepEqual(chooseSpies(["one"], 3, {}), ["one"]);
  const players = ["one", "two", "three", "four"];
  for (let i = 0; i < 50; i++) {
    const spies = chooseSpies(players, 2, { one: 2, two: 1, three: 1, four: 1 });
    assert.equal(spies.length, 2);
    assert.equal(new Set(spies).size, 2);
    assert.ok(spies.every(id => players.includes(id)));
  }
});
