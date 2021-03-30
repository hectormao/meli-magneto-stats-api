import { APIGatewayProxyResult } from "aws-lambda";
import { expect } from "chai";
import { describe, it } from "mocha";
import { anyString, instance, mock, verify, when } from "ts-mockito";
import { context, stat, event } from "../fixtures/fixtures";
import * as status from "http-status";
import { MagnetoStatsService } from "../../src/serv/magnetoStatsService";
import { StatsNotFoundError } from "../../src/exc/errors";
import TYPES from "../../src/config/types";

const proxyquire = require("proxyquire");

/**
 * Unit test for lambda aws handler function
 */
describe("Handler - Unit tests", async () => {
  /**
   * Test a successfully handler call
   * 1. Mock service
   * 2. Mock IoC container
   * 4. call handler function
   * 5. check if it returns a 200 status code
   */
  it("successfully handler", async () => {
    const serviceMock = mock(MagnetoStatsService);

    when(serviceMock.getStats(anyString())).thenResolve(stat);

    const service = instance(serviceMock);

    const handler = proxyquire("../../src/handler", {
      "./config/inversify.config": {
        default: {
          get: (type) => {
            if (type === TYPES.Service) {
              return service;
            } else {
              return "unit-test-stat";
            }
          },
        },
      },
    });

    const result: APIGatewayProxyResult = await handler.handler(
      event,
      context,
      null
    );

    expect(result.statusCode).is.equals(status.OK);
    verify(serviceMock.getStats(anyString())).once();
  });

  /**
   * Test a failed handler call, service raises an error
   * 1. Mock service raises an error
   * 2. Mock IoC container
   * 3. call handler function
   * 4. check if it returns a 500 status code
   */
  it("Failed handler - service error", async () => {
    const errorMessage: string = "Test Error";
    const serviceMock = mock(MagnetoStatsService);

    when(serviceMock.getStats(anyString())).thenReject(new Error(errorMessage));

    const service = instance(serviceMock);

    const handler = proxyquire("../../src/handler", {
      "./config/inversify.config": {
        default: {
          get: (type) => {
            if (type === TYPES.Service) {
              return service;
            } else {
              return "unit-test-stat";
            }
          },
        },
      },
    });

    const result: APIGatewayProxyResult = await handler.handler(
      event,
      context,
      null
    );

    verify(serviceMock.getStats(anyString())).once();
    expect(result.statusCode).is.equals(status.INTERNAL_SERVER_ERROR);
    expect(result.body).contains(errorMessage);
  });

  /**
   * Test a failed handler call, service raises a StatsNotFoundError
   * 1. Mock service
   * 2. Mock extractor raises an error
   * 3. Mock IoC container
   * 4. call handler function
   * 5. check if it returns a 404 status code
   */
  it("Failed handler - Stats not found", async () => {
    const errorMessage: string = "Test Error";
    const serviceMock = mock(MagnetoStatsService);

    when(serviceMock.getStats(anyString())).thenReject(
      new StatsNotFoundError(errorMessage)
    );

    const service = instance(serviceMock);

    const handler = proxyquire("../../src/handler", {
      "./config/inversify.config": {
        default: {
          get: (type) => {
            if (type === TYPES.Service) {
              return service;
            } else {
              return "unit-test-stat";
            }
          },
        },
      },
    });

    const result: APIGatewayProxyResult = await handler.handler(
      event,
      context,
      null
    );

    verify(serviceMock.getStats(anyString())).once();
    expect(result.statusCode).is.equals(status.NOT_FOUND);
    expect(result.body).contains(errorMessage);
  });
});
