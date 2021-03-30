import { expect } from "chai";
import { Container } from "inversify";
import { describe, it } from "mocha";
import { anyString, anything, instance, mock, when } from "ts-mockito";
import TYPES from "../../../src/config/types";
import { Stat } from "../../../src/ent/types";
import { MagnetoStatsRepo } from "../../../src/repo/magnetoStatsRepo";
import { MagnetoStatsService } from "../../../src/serv/magnetoStatsService";
import { stat } from "../../fixtures/fixtures";

/**
 * Unit tests for Magneto Mutant Service
 */
describe("Magneto Stats Service Unit Tests", async () => {
  /**
   * Test getStats Successful
   * 1. Mock Repository
   * 2. Build a valid IoC container
   * 3. Get the service from container
   * 4. Call getStats method
   * 5. Check if response is the same as the repo mock
   */
  it("Get stats successful", async () => {
    const repoMock = mock(MagnetoStatsRepo);
    when(repoMock.getStats(anyString())).thenResolve(stat);
    const repo = instance(repoMock);

    const container: Container = new Container();
    container.bind<MagnetoStatsRepo>(TYPES.Repository).toConstantValue(repo);
    container.bind<MagnetoStatsService>(TYPES.Service).to(MagnetoStatsService);

    const sut: MagnetoStatsService = container.get(TYPES.Service);

    const statResponse: Stat = await sut.getStats("test-stat");
    expect(statResponse).is.deep.equals(stat);
  });

  /**
   * Test getStat failed- repo error
   * 1. Mock Repo
   * 2. Build a valid IoC container
   * 3. Get the service from container
   * 4. Call getStat method
   * 5. Check if it raises a Error
   */
  it("Get stats failed - repo error", async () => {
    const errorMessage: string = "Test Error";
    const repoMock = mock(MagnetoStatsRepo);
    when(repoMock.getStats(anyString())).thenReject(new Error(errorMessage));
    const repo = instance(repoMock);

    const container: Container = new Container();
    container.bind<MagnetoStatsRepo>(TYPES.Repository).toConstantValue(repo);
    container.bind<MagnetoStatsService>(TYPES.Service).to(MagnetoStatsService);

    const sut: MagnetoStatsService = container.get(TYPES.Service);

    try {
      await sut.getStats("test-stat");
      expect.fail("Test must raise an exception");
    } catch (error) {
      expect(error).to.be.an.instanceof(Error);
      expect(error.message).is.equal(errorMessage);
    }
  });
});
