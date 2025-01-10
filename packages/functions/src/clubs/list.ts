import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { Util } from "@naija-football-admin-dashboard/core/util";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async () => {
  const params = {
    TableName: Resource.DashboardData.name, // Ensure this matches your table name
    FilterExpression: "begins_with(pk, :pkPrefix)",
    ExpressionAttributeValues: {
      ":pkPrefix": "CLUB#",
    },
  };

  console.log("Fetching list of clubs with Params:", params);

  const result = await dynamoDb.send(new ScanCommand(params));

  if (!result.Items || result.Items.length === 0) {
    return JSON.stringify([]);
  }

  // Optionally map the results for cleaner output
  const clubs = result.Items.map((item) => ({
    id: item.pk.replace("CLUB#", ""), // Extract club ID from pk
    name: item.name,
    location: item.location,
    foundedYear: item.foundedYear,
    logo: item.logo,
    coverImage: item.coverImage,
    description: item.description,
    createdAt: item.createdAt,
  }));

  return JSON.stringify(clubs);
});
