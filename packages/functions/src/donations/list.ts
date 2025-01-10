import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { Util } from "@naija-football-admin-dashboard/core/util";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
    const clubId = event.queryStringParameters?.clubId;
  
    const params = {
      TableName: Resource.DashboardData.name,
      FilterExpression: "begins_with(pk, :pkPrefix) AND sk = :skValue",
      ExpressionAttributeValues: {
        ":pkPrefix": "DONATION#",
        ":skValue": `CLUB#${clubId}`,
      },
    };
  
    console.log("Fetching donations for Club ID:", clubId);
  
    const result = await dynamoDb.send(new ScanCommand(params));
  
    if (!result.Items || result.Items.length === 0) {
      return JSON.stringify([]);
    }
  
    const donations = result.Items.map((item) => ({
      id: item.pk.replace("DONATION#", ""),
      clubId: item.clubId,
      donorName: item.donorName,
      amount: item.amount,
      message: item.message,
      createdAt: item.createdAt,
    }));
  
    return JSON.stringify(donations);
  });
  
