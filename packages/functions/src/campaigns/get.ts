import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { Util } from "@naija-football-admin-dashboard/core/util";


const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const campaignId = event.pathParameters?.id;

  if (!campaignId) {
    throw new Error("Missing campaign ID in the path parameters.");
  }

  const params = {
    TableName: Resource.DashboardData.name,
    Key: {
      pk: `CAMPAIGN#${campaignId}`, // Partition key for the campaign
      sk: "DETAILS", // Sort key for campaign details
    },
  };

  console.log("Fetching Campaign with Params:", params);

  const result = await dynamoDb.send(new GetCommand(params));

  if (!result.Item) {
    throw new Error(`Campaign with ID ${campaignId} not found.`);
  }

  return JSON.stringify(result.Item);
});
