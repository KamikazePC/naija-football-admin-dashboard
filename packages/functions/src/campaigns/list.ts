import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { Util } from "@naija-football-admin-dashboard/core/util";


const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async () => {
  const params = {
    TableName: Resource.DashboardData.name,
    FilterExpression: "begins_with(pk, :pkPrefix)",
    ExpressionAttributeValues: { 
      ":pkPrefix": "CAMPAIGN#",
    },
  };

  console.log("Fetching list of campaigns with Params:", params);

  const result = await dynamoDb.send(new ScanCommand(params));

  if (!result.Items || result.Items.length === 0) {
    return JSON.stringify([]);
  }

  const campaigns = result.Items.map((item) => ({
    id: item.pk.replace("CAMPAIGN#", ""), // Extract campaign ID from pk
    title: item.title,
    description: item.description,
    clubId: item.clubId,
    targetAmount: item.targetAmount,
    currentAmount: item.currentAmount,
    startDate: item.startDate,
    endDate: item.endDate,
    status: item.status,
    createdAt: item.createdAt,
  }));

  return JSON.stringify(campaigns);
});
