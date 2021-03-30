import {
  LoggerFactoryOptions,
  LoggerFactory,
  LFService,
  LogGroupRule,
  LogLevel,
} from "typescript-logging";

/**
 * Logger Config
 */
const options = new LoggerFactoryOptions().addLogGroupRule(
  new LogGroupRule(new RegExp(".+"), LogLevel.Trace)
);
export const loggerFactory: LoggerFactory = LFService.createLoggerFactory(
  options
);
