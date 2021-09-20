const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  buildSchema,
} = require("graphql");
const { GraphQLUpload, graphqlUploadExpress } = require("graphql-upload");
const { graphqlHTTP } = require("express-graphql");
const express = require("express");
const { createWriteStream } = require("fs");

const app = express();

// var queryType = new GraphQLObjectType({
//   name: "Query",
//   fields: {
//     message: {
//       type: GraphQLString,
//     },
//     resolve: () => {
//       return "hello world";
//     },
//   },
// });

// var fakeDatabase = {
//   a: {
//     id: "a",
//     name: "alice",
//   },
//   b: {
//     id: "b",
//     name: "bob",
//   },
// };

// var userType = new GraphQLObjectType({
//   name: "User",
//   fields: {
//     id: { type: GraphQLString },
//     name: { type: GraphQLString },
//   },
// });

var queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    user: {
      //   type: userType,
      //   args: {
      //     id: { type: GraphQLString },
      //   },
      type: GraphQLString,
      resolve: (_, { id }) => {
        return "hello world";
      },
    },
  },
});

var mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    uploadImage: {
      description: "Uploads an image.",
      type: GraphQLBoolean,
      args: {
        image: {
          description: "Image file.",
          type: GraphQLUpload,
        },
      },
      async resolve(parent, { image }) {
        const { filename, mimetype, createReadStream } = await image;
        const stream = createReadStream();
        // Promisify the stream and store the file, then…
        return new Promise(async (resolve, reject) => {
          createReadStream()
            .pipe(createWriteStream(__dirname + `/images/${filename}`))
            .on("finish", () => {
              resolve(true);
            })
            .on("error", () => {
              reject(false);
              console.log("hifds");
            });
        });
      },
    },
  },
});

var schema = new GraphQLSchema({ query: queryType, mutation: mutationType });

app.use(express.json());
app.use(
  "/graphql",
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("server started");
});
