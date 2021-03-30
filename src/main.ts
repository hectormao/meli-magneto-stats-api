import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { handler } from "./handler";

const contextMock: Context = {
  callbackWaitsForEmptyEventLoop: null,
  functionName: null,
  functionVersion: null,
  invokedFunctionArn: null,
  memoryLimitInMB: null,
  awsRequestId: null,
  logGroupName: null,
  logStreamName: null,
  getRemainingTimeInMillis: null,
  done: null,
  fail: null,
  succeed: null,
};

const eventMock = {} as APIGatewayProxyEvent;

const resultPromise: Promise<APIGatewayProxyResult> = handler(
  eventMock,
  contextMock,
  null
) as Promise<APIGatewayProxyResult>;
resultPromise.then(
  (result) => console.log(result),
  (error) => console.error(error)
);
