import type { NextFunction, Request, Response } from "express";
import { describe, expect, test, vi } from "vitest";

import { AppError } from "#lib/app-error.ts";

import { errorHandler } from "./error.ts";

const mockRes = () => {
	const json = vi.fn();
	const status = vi.fn().mockReturnValue({ json });
	return { status, json, headersSent: false };
};

const req = {} as unknown as Request;

const body = (res: ReturnType<typeof mockRes>) =>
	res.status.mock.results[0].value.json.mock.calls[0][0];

describe("errorHandler", () => {
	test("calls next(err) and does not call res.status when headersSent is true", () => {
		const err = new Error("whatever");
		const res = { ...mockRes(), headersSent: true };
		const next = vi.fn();
		errorHandler(err, req, res as unknown as Response, next);
		expect(next).toHaveBeenCalledWith(err);
		expect(res.status).not.toHaveBeenCalled();
	});

	test("an AppError without details: response body has no details key", () => {
		const err = new AppError(404, "not_found", "missing");
		const res = mockRes();
		const next = vi.fn();
		errorHandler(err, req, res as unknown as Response, next);
		expect(res.status).toHaveBeenCalledWith(404);
		expect(body(res)).not.toHaveProperty("details");
		expect(body(res).code).toBe("not_found");
		expect(body(res).message).toBe("missing");
	});

	test("an AppError with details: response body includes the details value", () => {
		const details = { field: "x" };
		const err = new AppError(400, "invalid_argument", "bad", details);
		const res = mockRes();
		errorHandler(err, req, res as unknown as Response, vi.fn() as NextFunction);
		expect(body(res).details).toEqual(details);
	});

	test("body-parser entity.parse.failed renders 400 with code invalid_json", () => {
		const err = Object.assign(new Error("bad"), {
			type: "entity.parse.failed",
		});
		const res = mockRes();
		errorHandler(err, req, res as unknown as Response, vi.fn() as NextFunction);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(body(res).code).toBe("invalid_json");
	});

	test("unknown error renders 500 with code internal", () => {
		const err = new Error("some unexpected failure");
		const res = mockRes();
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		errorHandler(err, req, res as unknown as Response, vi.fn() as NextFunction);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(body(res).code).toBe("internal");
		consoleSpy.mockRestore();
	});
});
