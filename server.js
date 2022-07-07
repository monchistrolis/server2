const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server-express");
const Persona = require("./models/persona");
const cors = require("cors");

mongoose.connect(
  "mongodb+srv://mochistrolis:83245112r1a2a3@cluster0.qolq8.mongodb.net/frontend",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const typeDefs = gql`
  type Persona {
    id: ID!
    rut: String!
    nombre: String!
    apellido:String!
    contrasena: String!
  }
  type Alert {
    message: String
  }
  input PersonaInput {
    rut: String!
    nombre: String!
    apellido: String!
    contrasena: String!
  }
  type Query {
    getPersonas(page: Int, limit: Int = 1): [Persona]
    getPersona(id: Int): Persona
  }
  type Mutation {
    addPersona(input: PersonaInput): Persona
    updPersona(id: Int, input: PersonaInput): Persona
    delPersona(id: Int): Alert
  }
`;

const resolvers = {
  Query: {
    async getPersonas(obj, { page, limit }) {
      const personas = await Persona.find();
      return personas;
    },
    async getPersona(obj, { id }) {
      const persona = await Persona.findById(id);
      return persona;
    },
  },
  Mutation: {
    async addPersona(obj, { input }) {
      const persona = new Persona(input);
      persona.save();
      return persona;
    },
    async updPersona(obj, { id, input }) {
      const persona = await Persona.findByIdAndUpdate(id, input);
      return persona;
    },
    async delPersona(obj, { id }) {
      await Persona.deleteOne({ _id: id });
      return {
        message: `la persona ${id} fue eliminada`,
      };
    },
  },
};

let apolloServer = null;

const corsOptions = {
  origin: "http://localhost:8090/graphql",
  credentials: false,
};

async function startServer() {
  const apolloServer = new ApolloServer({ typeDefs, resolvers, corsOptions });
  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });
}

startServer();

const app = new express();
app.use(cors());
app.listen(8090, function () {
  console.log("servidor iniciado");
});