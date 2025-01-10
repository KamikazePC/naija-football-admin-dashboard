

// Create an S3 bucket
export const bucket = new sst.aws.Bucket("DashboardUploads");

// Create the DynamoDB table
export const table = new sst.aws.Dynamo("DashboardData", {
    fields: {
      pk: "string",
      sk: "string",
      type: "string",
      data: "string"
    },
    primaryIndex: { hashKey: "pk", rangeKey: "sk" },
    globalIndexes: {
      byType: {
        hashKey: "type",
        rangeKey: "data",
        projection: "all"
      }
    }
  })
