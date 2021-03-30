import { Logger } from "typescript-logging";
import { loggerFactory } from "../log/configLog";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import TYPES from "../config/types";
import { MagnetoStatsRepo } from "../repo/magnetoStatsRepo";
import { Stat } from "../ent/types";

const log: Logger = loggerFactory.getLogger("ProductService");

/**
 * Service Component to get the stats
 * It raises these exceptions:
 * - StatsNotFoundError -> when stat name doesn't exist
 */
@injectable()
class MagnetoStatsService {
  constructor(
    @inject(TYPES.Repository) private readonly repository: MagnetoStatsRepo
  ) {}

  /**
   * Get the stats by name
   * @param statName
   * @returns
   */
  public async getStats(statName: string): Promise<Stat> {
    log.info({
      msg: "getting stat  ...",
      data: { statName },
    });

    const stat: Stat = await this.repository.getStats(statName);

    log.info({ msg: "Stat ... ", data: { stat } });
    return stat;
  }
}

export { MagnetoStatsService };
