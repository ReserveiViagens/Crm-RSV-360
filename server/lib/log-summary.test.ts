import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  countBodyItems,
  formatResponseBodyLogFragment,
  measureBodyBytes,
  summarizeBody,
} from "./log-summary.ts";

describe("summarizeBody", () => {
  it("returns short strings as-is", () => {
    assert.equal(summarizeBody("ok"), "ok");
    assert.equal(summarizeBody(null), "null");
    assert.equal(summarizeBody(undefined), "[undefined]");
  });

  it("truncates large objects and reports byte size", () => {
    const body = { items: Array.from({ length: 50 }, (_, i) => ({ id: i, name: `item-${i}` })) };
    const out = summarizeBody(body, 80);
    assert.match(out, /… \[truncated, \d+ bytes\]$/);
    assert.ok(out.length > 80);
    assert.ok(out.startsWith('{"items":'));
  });

  it("handles arrays", () => {
    const out = summarizeBody(["a", "b", "c"], 500);
    assert.equal(out, '["a","b","c"]');
  });

  it("does not throw on circular references", () => {
    const circular: Record<string, unknown> = { a: 1 };
    circular.self = circular;
    const out = summarizeBody(circular, 500);
    assert.match(out, /Circular/);
  });
});

describe("measureBodyBytes / countBodyItems", () => {
  it("counts items from common payload shapes", () => {
    assert.equal(countBodyItems([1, 2, 3]), 3);
    assert.equal(countBodyItems({ items: [1, 2] }), 2);
    assert.equal(countBodyItems({ data: ["x"] }), 1);
    assert.equal(countBodyItems({ foo: 1 }), undefined);
  });

  it("measures utf8 bytes", () => {
    assert.equal(measureBodyBytes("abc"), 3);
    assert.ok(measureBodyBytes({ a: 1 }) > 0);
  });
});

describe("formatResponseBodyLogFragment", () => {
  const big = {
    items: Array.from({ length: 40 }, (_, i) => ({ id: i, title: `Hotel ${i}` })),
  };

  it("production success: metadata only, zero content", () => {
    const frag = formatResponseBodyLogFragment(big, {
      production: true,
      statusCode: 200,
    });
    assert.match(frag, /^ :: \[body omitted\] \d+ bytes, 40 items$/);
    assert.doesNotMatch(frag, /Hotel/);
    assert.doesNotMatch(frag, /"items"/);
  });

  it("production error: message only", () => {
    const frag = formatResponseBodyLogFragment(
      { message: "Not found", stack: "secret", items: big.items },
      { production: true, statusCode: 404 },
    );
    assert.equal(frag, ' :: {"message":"Not found"}');
    assert.doesNotMatch(frag, /secret|Hotel/);
  });

  it("dev: truncated preview", () => {
    const frag = formatResponseBodyLogFragment(big, {
      production: false,
      statusCode: 200,
      limit: 60,
    });
    assert.match(frag, /^ :: \{/);
    assert.match(frag, /truncated/);
  });
});
