import { DynamoDB } from "aws-sdk";
import { GetItemInput, GetItemOutput } from "aws-sdk/clients/dynamodb";
import { inject, injectable } from "inversify";
import { Logger } from "typescript-logging";
import TYPES from "../config/types";
import { Stat, StatRecord } from "../ent/types";
import { StatsNotFoundError } from "../exc/errors";
import { loggerFactory } from "../log/configLog";

const log: Logger = loggerFactory.getLogger("repository");

/**
 * Repository to get the magneto stats
 */
@injectable()
export class MagnetoStatsRepo {
  constructor(
    @inject(TYPES.DbClient) private readonly client: DynamoDB,
    @inject(TYPES.StatsTable) private readonly statsTable: string
  ) {}

  /**
   * Get Stat by name
   * @param statName
   * @returns
   */
  public async getStats(statName: string): Promise<Stat> {
    log.info({ msg: "Getting Stats", data: { statName } });

    const params: GetItemInput = {
      TableName: this.statsTable,
      Key: {
        statName: { S: statName },
      },
    };

    const getResult: GetItemOutput = await this.client
      .getItem(params)
      .promise();
    log.debug({ msg: "GetItemOutput", data: { getResult } });

    if (!getResult.Item) {
      throw new StatsNotFoundError("Stat not found: " + statName);
    }

    const item: StatRecord = DynamoDB.Converter.unmarshall(
      getResult.Item
    ) as StatRecord;

    const total: number = item.countHumanDNA + item.countMutantDNA;

    const ratio: number = total > 0 ? item.countMutantDNA / total : 0;

    return {
      count_human_dna: item.countHumanDNA,
      count_mutant_dna: item.countMutantDNA,
      ratio,
    } as Stat;
  }
}
