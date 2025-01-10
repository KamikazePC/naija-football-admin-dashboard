import * as uuid from "uuid";
import { Resource } from "sst";
import { Util } from "@naija-football-admin-dashboard/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  if (!event.body) {
    throw new Error("Missing request body");
  }

  const data = JSON.parse(event.body);

  if (!data.name || !data.location || !data.foundedYear) {
    throw new Error("Missing required fields: name, location, or foundedYear");
  }

  const params = {
    TableName: Resource.DashboardData.name, // Replace with your actual table reference
    Item: {
      pk: `CLUB#${uuid.v4()}`, // Partition key for the club
      sk: "DETAILS", // Sort key for club details
      type: "CLUB",
      data: JSON.stringify({
        name: data.name,
        location: data.location,
        foundedYear: data.foundedYear,
        logo: data.logo || null,
        coverImage: data.coverImage || null,
        description: data.description || "",
        createdAt: new Date().toISOString(), // Timestamp for record creation
      }),
    },
  };

  console.log("DynamoDB Table Name:", Resource.DashboardData.name);
  console.log("Creating Club with Params:", params);

  await dynamoDb.send(new PutCommand(params));

  return JSON.stringify(params.Item);
});
