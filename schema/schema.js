const graphql = require("graphql");
const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;

const TodoType = new GraphQLObjectType({
  name: "Todo",
  fields: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    status: { type: GraphQLBoolean },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    todos: {
      type: new GraphQLList(TodoType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:8900/todos`).then((res) => res.data);
      },
    },
  },
});

const MutationQuery = new GraphQLObjectType({
  name: "MutationQueryType",
  fields: {
    addTodo: {
      type: TodoType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLBoolean },
      },
      resolve(parentValue, args) {
        return axios
          .post(`http://localhost:8900/todos`, {
            title: args.title,
            status: false,
          })
          .then((res) => res.data);
      },
    },
    updateTodo: {
      type: TodoType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        return axios.patch(`http://localhost:8900/todos/${args.id}`, {
          status: true,
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: MutationQuery,
});
