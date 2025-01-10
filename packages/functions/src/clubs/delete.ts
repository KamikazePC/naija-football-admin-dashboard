import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { Util } from "@naija-football-admin-dashboard/core/util";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const clubId = event.pathParameters?.id;

  if (!clubId) {
    throw new Error("Missing club ID in the path parameters.");
  }

  const params = {
    TableName: Resource.DashboardData.name, // Ensure this matches your table name
    Key: {
      pk: `CLUB#${clubId}`, // Partition key for the club
      sk: "DETAILS", // Sort key for club details
    },
  };

  console.log("Deleting Club with Params:", params);

  const result = await dynamoDb.send(new DeleteCommand(params));

  if (!result.Attributes) {
    throw new Error(`Club with ID ${clubId} not found.`);
  }

  return JSON.stringify({
    message: `Club with ID ${clubId} has been deleted successfully.`,
    deletedItem: result.Attributes,
  });
});
