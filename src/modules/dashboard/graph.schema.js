import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { dashboardMutation, dashboardQuery } from "./graphQl/field.js";

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "query",
    fields: {
      ...dashboardQuery,
    },
  }),
  mutation: new GraphQLObjectType({
    name: "mutation",
    fields: {
      ...dashboardMutation,
    },
  }),
});
