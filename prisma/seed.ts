import { Joke, PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const getJokes = (): Partial<Joke>[] => [
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
  await Promise.all(getJokes().map((data: any) => db.joke.create({ data })));
}

seed()
