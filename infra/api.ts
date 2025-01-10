
import { table } from "./storage";

export const api = new sst.aws.ApiGatewayV2("Api", {
  transform: {
    route: {
      handler: {
        link: [table]
      }, 
      // args: {
      //   auth: {iam: true}
      // }
    }
  }
});

// Clubs endpoints
api.route("POST /clubs", "packages/functions/src/clubs/create.main");
api.route("GET /clubs/{id}", "packages/functions/src/clubs/get.main");
api.route("GET /clubs", "packages/functions/src/clubs/list.main");
api.route("PUT /clubs/{id}", "packages/functions/src/clubs/update.main");
api.route("DELETE /clubs/{id}", "packages/functions/src/clubs/delete.main");

// // Donations endpoints
api.route("GET /donations", "packages/functions/src/donations/list.main");

// // Campaigns endpoints
api.route("GET /campaigns/{id}", "packages/functions/src/campaigns/get.main");
api.route("GET /campaigns", "packages/functions/src/campaigns/list.main");
