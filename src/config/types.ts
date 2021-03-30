/**
 * Ioc Types to inject components
 */
const TYPES = {
  Repository: Symbol("Repository"),
  DbClient: Symbol("DbClient"),
  StatsTable: Symbol("StatsTable"),
  Service: Symbol("Service"),
  StatName: Symbol("StatName"),
};

export default TYPES;
