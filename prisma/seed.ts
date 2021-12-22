import { Joke, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const db = new PrismaClient();

const jokes = [
  {
    title: "Dinner",
    content: "What did one plate say to the other plate? Dinner is on me!"
  },
  {
    title: "Trees",
    content: "Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady."
  }
]

const seed = async () => {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash('weakpassword', salt)
  const data = {
    username: 'kevinfarts',
    passwordHash: hash,
  }
  const user = await db.user.create({ data })
  await Promise.all(jokes.map((joke: any) => {
    const data: Joke = {...joke, authorId: user.id }
    return db.joke.create({ data })
  }));
}

seed()
