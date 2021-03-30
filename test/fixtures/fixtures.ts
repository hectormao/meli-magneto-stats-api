import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { GetItemOutput } from "aws-sdk/clients/dynamodb";
import { Stat } from "../../src/ent/types";

export const event = {} as APIGatewayProxyEvent;

export const context = {} as Context;

export const stat: Stat = {
  count_human_dna: 60,
  count_mutant_dna: 40,
  ratio: 0.4,
};

export const statQueryResponse: GetItemOutput = {
  Item: {
    statName: { S: "test_unit_stats" },
    countMutantDNA: { N: "40" },
    countHumanDNA: { N: "60" },
  },
};

export const emptyQueryResponse: GetItemOutput = {
  Item: null,
};
