import * as AWS from "aws-sdk-mock";
import { DynamoDB } from "aws-sdk";
import { Container } from "inversify";
import TYPES from "../../../src/config/types";
import { expect } from "chai";
import {
  emptyQueryResponse,
  stat,
  statQueryResponse,
} from "../../fixtures/fixtures";
import { MagnetoStatsRepo } from "../../../src/repo/magnetoStatsRepo";
import { Stat } from "../../../src/ent/types";
import { StatsNotFoundError } from "../../../src/exc/errors";

/**
 * Unit tests for Magneto Mutant Service
 */
describe("Magneto Stat Repository Unit Tests", async () => {
  /**
   * Test a Successful repo call
   * 1. Mock DynamoDB Client
   * 2. Build a valid IoC container
   * 3. Get the reposotory from container
   * 4. Call getStats method
   * 5. get the response is equals to mocked value
   */
  it("Successful call", async () => {
    AWS.mock("DynamoDB", "getItem", function (params, callback) {
      callback(null, statQueryResponse);
    });

    const dynamoClient = new DynamoDB();
    const container = new Container();
    container.bind<string>(TYPES.StatsTable).toConstantValue("stats_unit_test");
    container.bind<DynamoDB>(TYPES.DbClient).toConstantValue(dynamoClient);
    container.bind<MagnetoStatsRepo>(TYPES.Repository).to(MagnetoStatsRepo);

    const sut: MagnetoStatsRepo = container.get(TYPES.Repository);

    const statResult: Stat = await sut.getStats("test-unit-stat");

    expect(statResult).is.deep.equals(stat);

    AWS.restore("DynamoDB");
  });

  /**
   * Test a Failed DynamoDB call
   * 1. Mock DynamoDB Client
   * 2. Build a valid IoC container
   * 3. Get the reposotiry from container
   * 4. Call getStats method
   * 5. Check if it raises an Error
   */
  it("Failed dynamodb call", async () => {
    AWS.mock("DynamoDB", "getItem", function (params, callback) {
      callback(new Error("Test Error"), null);
    });

    const dynamoClient = new DynamoDB();
    const container = new Container();
    container.bind<string>(TYPES.StatsTable).toConstantValue("stats_unit_test");
    container.bind<DynamoDB>(TYPES.DbClient).toConstantValue(dynamoClient);
    container.bind<MagnetoStatsRepo>(TYPES.Repository).to(MagnetoStatsRepo);

    const sut: MagnetoStatsRepo = container.get(TYPES.Repository);

    try {
      await sut.getStats("test-unit-stat");
    } catch (error) {
      expect(error).is.not.null;
    }

    AWS.restore("DynamoDB");
  });

  /**
   * Test when stat name desn't exists
   * 1. Mock DynamoDB Client
   * 2. Build a valid IoC container
   * 3. Get the reposotiry from container
   * 4. Call getStats method
   * 5. Check if it raises a StatsNotFoundError
   */
  it("Stat Not Found", async () => {
    AWS.mock("DynamoDB", "getItem", function (params, callback) {
      callback(null, emptyQueryResponse);
    });

    const dynamoClient = new DynamoDB();
    const container = new Container();
    container.bind<string>(TYPES.StatsTable).toConstantValue("stats_unit_test");
    container.bind<DynamoDB>(TYPES.DbClient).toConstantValue(dynamoClient);
    container.bind<MagnetoStatsRepo>(TYPES.Repository).to(MagnetoStatsRepo);

    const sut: MagnetoStatsRepo = container.get(TYPES.Repository);

    try {
      await sut.getStats("test-unit-stat");
    } catch (error) {
      expect(error).is.instanceOf(StatsNotFoundError);
    }

    AWS.restore("DynamoDB");
  });
});
