import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { Util } from "@naija-football-admin-dashboard/core/util";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const clubId = event.pathParameters?.id;

  if (!clubId) {
    throw new Error("Missing club ID in the path parameters.");
  }

  if (!event.body) {
    throw new Error("Missing request body.");
  }

  const data = JSON.parse(event.body);

  if (!data.name && !data.location && !data.foundedYear && !data.logo && !data.coverImage && !data.description) {
    throw new Error("No valid fields to update.");
  }

  const params = {
    TableName: Resource.DashboardData.name, // Ensure this matches your table name
    Key: {
      pk: `CLUB#${clubId}`, // Partition key for the club
      sk: "DETAILS", // Sort key for club details
    },
    UpdateExpression: `
      SET 
        ${data.name ? "#name = :name," : ""}
        ${data.location ? "#location = :location," : ""}
        ${data.foundedYear ? "#foundedYear = :foundedYear," : ""}
        ${data.logo ? "#logo = :logo," : ""}
        ${data.coverImage ? "#coverImage = :coverImage," : ""}
        ${data.description ? "#description = :description," : ""}
        updatedAt = :updatedAt
    `.replace(/,\s*$/, ""), // Remove trailing comma
    ExpressionAttributeNames: {
      ...(data.name && { "#name": "name" }),
      ...(data.location && { "#location": "location" }),
      ...(data.foundedYear && { "#foundedYear": "foundedYear" }),
      ...(data.logo && { "#logo": "logo" }),
      ...(data.coverImage && { "#coverImage": "coverImage" }),
      ...(data.description && { "#description": "description" }),
    },
    ExpressionAttributeValues: {
      ...(data.name && { ":name": data.name }),
      ...(data.location && { ":location": data.location }),
      ...(data.foundedYear && { ":foundedYear": data.foundedYear }),
      ...(data.logo && { ":logo": data.logo }),
      ...(data.coverImage && { ":coverImage": data.coverImage }),
      ...(data.description && { ":description": data.description }),
      ":updatedAt": new Date().toISOString(),
    }
  };

  console.log("Updating Club with Params:", params);

  await dynamoDb.send(new UpdateCommand(params));

  return JSON.stringify({ status: true });
});
