import "reflect-metadata";
import { Container } from "inversify";
import TYPES from "./types";
import { DynamoDB, config } from "aws-sdk";
import { MagnetoStatsRepo } from "../repo/magnetoStatsRepo";
import { MagnetoStatsService } from "../serv/magnetoStatsService";

/**
 * IoC Container Configuration
 */

const container: Container = new Container();

const statName: string = process.env["STAT_NAME"] || "mutant_stats";
const statsTable: string = process.env["STATS_TABLE"] || "magneto-stats-dev";

config.update({
  region: process.env["AWS_REGION"] || "us-east-1",
});
const dynamoClient: DynamoDB = new DynamoDB();

container.bind<MagnetoStatsRepo>(TYPES.Repository).to(MagnetoStatsRepo);
container.bind<MagnetoStatsService>(TYPES.Service).to(MagnetoStatsService);
container.bind<string>(TYPES.StatName).toConstantValue(statName);
container.bind<string>(TYPES.StatsTable).toConstantValue(statsTable);
container.bind<DynamoDB>(TYPES.DbClient).toConstantValue(dynamoClient);

export default container;
