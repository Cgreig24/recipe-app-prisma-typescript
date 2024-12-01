"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { PrismaClient } from "@prisma/client/extension";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
//export default prisma;
module.exports = prisma;
