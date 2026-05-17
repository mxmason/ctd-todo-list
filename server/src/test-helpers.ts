import request from "supertest";

import { app } from "#app";

/** Start a supertest request against the app under test. */
export const api = () => request(app);

/** A supertest agent that persists cookies across requests (e.g. sessions). */
export const agent = () => request.agent(app);
