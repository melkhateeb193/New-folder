import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import * as DR from "./resolve.js";
import * as DT from "./type.js";

// export const dashboardQuery = {
//   getAllUsers: {
//     type: new GraphQLObjectType({
//       name: "allUsers",
//       fields: () => {
//         return {
//           Page: { type: GraphQLInt },
//           totalCount: { type: GraphQLInt },
//           data: { type: new GraphQLList(DT.userType) },
//         };
//       },
//     }),
//     args: {
//       page: { type: new GraphQLNonNull(GraphQLInt) },
//       limit: { type: new GraphQLNonNull(GraphQLInt) },
//       authorization: { type: new GraphQLNonNull(GraphQLString) },
//     },
//     resolve: DR.getAllUsers,
//   },
//   /*******************************************************************************/
//   getAllCompanies: {
//     type: new GraphQLObjectType({
//       name: "allCompanies",
//       fields: () => {
//         return {
//           Page: { type: GraphQLInt },
//           totalCount: { type: GraphQLInt },
//           data: { type: new GraphQLList(DT.companyType) },
//         };
//       },
//     }),
//     args: {
//       page: { type: new GraphQLNonNull(GraphQLInt) },
//       limit: { type: new GraphQLNonNull(GraphQLInt) },
//       authorization: { type: new GraphQLNonNull(GraphQLString) },
//     },
//     resolve: DR.getAllCompanies,
//   },
// };
export const dashboardQuery = {
  getAllUsers: {
    type: DT.userType, // Use the defined type instead of creating it inline
    args: {
      page: { type: new GraphQLNonNull(GraphQLInt) },
      limit: { type: new GraphQLNonNull(GraphQLInt) },
      authorization: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: DR.getAllUsers,
  },

  getAllCompanies: {
    type: DT.companyType, // Use the defined type
    args: {
      page: { type: new GraphQLNonNull(GraphQLInt) },
      limit: { type: new GraphQLNonNull(GraphQLInt) },
      authorization: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: DR.getAllCompanies,
  },
};
/*******************************************************************************/

export const dashboardMutation = {
  banOrUnBanUser: {
    type: GraphQLString,
    args: {
      userId: { type: new GraphQLNonNull(GraphQLID) },
      action: { type: new GraphQLNonNull(GraphQLString) },
      authorization: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: DR.banOrUnBanUser,
  },
  banOrUnBanCompany: {
    type: GraphQLString,
    args: {
      companyId: { type: new GraphQLNonNull(GraphQLID) },
      action: { type: new GraphQLNonNull(GraphQLString) },
      authorization: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: DR.banOrUnBanCompany,
  },

  /*******************************************************************************/
  approveCompany: {
    type: GraphQLString,
    args: {
      companyId: { type: new GraphQLNonNull(GraphQLID) },
      authorization: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: DR.approveCompany,
  },
};
