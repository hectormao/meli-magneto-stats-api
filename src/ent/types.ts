/**
 * Response Data Model
 */
export interface Stat {
  count_mutant_dna: number;
  count_human_dna: number;
  ratio: number;
}

/**
 * DynamoDB stat record data model
 */
export interface StatRecord {
  statName: string;
  countHumanDNA: number;
  countMutantDNA: number;
}
