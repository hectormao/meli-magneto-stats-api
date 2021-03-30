process.env["STAT_NAME"] = "test-integ-stat";
process.env["STATS_TABLE"] = "magneto-stats-integ-test";

import * as AWS from "aws-sdk-mock";

let emptyResponse = false;

AWS.mock("DynamoDB", "getItem", function (params, callback) {
  if (emptyResponse) {
    callback(null, emptyResponse);
  } else {
    callback(null, statQueryResponse);
  }
});

import { APIGatewayProxyResult } from "aws-lambda";
import { expect } from "chai";
import { describe, it } from "mocha";
import { handler } from "../../src/handler";
import { context, stat, event, statQueryResponse } from "../fixtures/fixtures";
import * as status from "http-status";

/**
 * Integration Test for Magneto stats
 */
describe("Magneto Mutant Checker Integration Test", async () => {
  after(async () => {
    AWS.restore("DynamoDB");
  });

  /**
   * Get Stats successful
   * 1. Call handler method
   * 2. Check if the response status is 200
   */
  it("Get Stats", async () => {
    emptyResponse = false;
    const result: APIGatewayProxyResult | void = await handler(
      event,
      context,
      null
    );
    expect(result).is.not.null;
    const validResult = result as APIGatewayProxyResult;
    expect(validResult.statusCode).is.equals(status.OK);
  });

  /**
   * Get Stats failed
   * 1. Call handler method
   * 2. Check if the response status is 404
   */
  it("Get Stats Failed", async () => {
    emptyResponse = true;
    const result: APIGatewayProxyResult | void = await handler(
      event,
      context,
      null
    );
    expect(result).is.not.null;
    const validResult = result as APIGatewayProxyResult;
    expect(validResult.statusCode).is.equals(status.NOT_FOUND);
  });
});
