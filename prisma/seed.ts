import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getUsers().map((user) => {
      return db.user.create({ data: user });
    })
  );
}

seed();

function getUsers() {
  return [
    {
      "username": "john_doe",
      "email": "john@example.com",
      "name": "John Doe",
      passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
      "bio": "I'm a software engineer interested in AI and machine learning.",
      "pfp": "https://api.dicebear.com/7.x/lorelei/png",
      "interests": ["Trekking"],
      "tech": ["JavaScript", "Python"],
      "pronouns": "he/him",
      "projects": [],
      "dob": new Date(1990, 1, 1),
    },
    {
      "username": "jane_smith",
      passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
      "email": "jane@example.com",
      "name": "Jane Smith",
      "bio": "Passionate about travel and photography.",
      "pfp": "https://api.dicebear.com/7.x/lorelei/png",
      "interests": ["Travel", "Photography", "Nature"],
      "tech": ["Java", "C++"],
      "pronouns": "she/her",
      "projects": [],
      "dob": new Date(1990, 1, 1),
    },
  ]
}

