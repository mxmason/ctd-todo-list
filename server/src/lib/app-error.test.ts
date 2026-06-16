import { describe, expect, test } from "vitest";
import { z } from "zod";

import { AppError, isAppError, validate } from "./app-error.ts";

describe("AppError", () => {
	test("has the correct status, code, message when constructed", () => {
		const err = new AppError(404, "not_found", "thing not found");
		expect(err.status).toBe(404);
		expect(err.code).toBe("not_found");
		expect(err.message).toBe("thing not found");
		expect(err.name).toBe("AppError");
	});

	test("details is undefined when not passed", () => {
		const err = new AppError(400, "invalid_argument", "bad input");
		expect(err.details).toBeUndefined();
	});

	test("details is set when passed", () => {
		const details = { field: "email", issue: "required" };
		const err = new AppError(400, "invalid_argument", "bad input", details);
		expect(err.details).toEqual(details);
	});
});

describe("isAppError", () => {
	test("returns true for AppError instances", () => {
		expect(isAppError(new AppError(500, "internal", "oops"))).toBe(true);
	});

	test("returns false for plain errors", () => {
		expect(isAppError(new Error("plain"))).toBe(false);
	});

	test("returns false for non-error values", () => {
		expect(isAppError("string")).toBe(false);
		expect(isAppError(null)).toBe(false);
	});
});

describe("validate", () => {
	const schema = z.object({ n: z.number() });

	test("returns parsed data for valid input", () => {
		expect(validate(schema, { n: 1 })).toEqual({ n: 1 });
	});

	test("throws AppError(400, invalid_argument) with details for invalid input", () => {
		expect.assertions(3);
		try {
			validate(schema, { n: "not-a-number" });
		} catch (err) {
			expect(isAppError(err)).toBe(true);
			if (isAppError(err)) {
				expect(err.status).toBe(400);
				expect(err.code).toBe("invalid_argument");
			}
		}
	});

	test("details field is populated on validation failure", () => {
		expect.assertions(1);
		try {
			validate(schema, { n: "bad" });
		} catch (err) {
			if (isAppError(err)) expect(err.details).toBeDefined();
		}
	});
});
