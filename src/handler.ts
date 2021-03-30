import {
  Context,
  APIGatewayProxyHandler,
  APIGatewayEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { Logger } from "typescript-logging";
import { loggerFactory } from "./log/configLog";
import container from "./config/inversify.config";
import TYPES from "./config/types";
import * as status from "http-status";
import { MagnetoStatsService } from "./serv/magnetoStatsService";
import { Stat } from "./ent/types";

const log: Logger = loggerFactory.getLogger("handler");
/**
 * API Gateway Event Handler for Get Stats
 * @param event API Gateway Event
 * @param context AWS Call Context
 * @returns APIGatewayProxyResult
 */
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  log.info({ msg: "Receiving API Gateway event", data: { event, context } });
  try {
    const service: MagnetoStatsService = container.get(TYPES.Service);
    const statName: string = container.get(TYPES.StatName);
    const stats: Stat = await service.getStats(statName);
    return {
      statusCode: status.OK,
      body: JSON.stringify(stats),
    } as APIGatewayProxyResult;
  } catch (error) {
    log.error("Error processing dna ...", error);
    const statusCode: number = error.status || status.INTERNAL_SERVER_ERROR;
    const body: any = {
      code: statusCode,
      message: error.message,
    };
    return {
      statusCode: error.status || status.INTERNAL_SERVER_ERROR,
      body: JSON.stringify(body),
    } as APIGatewayProxyResult;
  }
};
