import { PrismaClient } from "@prisma/client";

// why this file?
// This file is used to create a single instance of PrismaClient that can be reused throughout the application.
// This is useful because creating a new instance of PrismaClient for every request can be inefficient.
// In development, we attach the client to the global object to reuse the instance.
// In production, we create a new instance of PrismaClient for every request.

// samja?
//devlopment time a vare vare each onsave par  db hare connect no that ekaj var thay etla mate chhe aa...

let prisma: PrismaClient;

declare global {
  var prisma: PrismaClient | undefined;
}

// In development, we attach the client to the `global` object to reuse the instance.
if (process.env.MODE === "development") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
} else {
  prisma = new PrismaClient();
}

export default prisma;
