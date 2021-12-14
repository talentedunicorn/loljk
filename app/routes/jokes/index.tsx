import { Link, LoaderFunction, useLoaderData } from "remix"
import { Joke } from "@prisma/client";
import { db } from "~/utils/db.server"

export const loader: LoaderFunction = async () => {
  const count = await db.joke.count();
  const randomNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomNumber
  })
  return randomJoke
}

export default function jokeIndex() {
  const data: Joke = useLoaderData<Joke>()
  return (
    <aside>
      <h2 className="Title">Here's a random joke</h2>
      <article className="Card">
        <h3 className="CardTitle">{data.title}</h3>
        <p>{data.content}</p>
        <Link to={`/jokes/${data.id}`}>Permalink</Link>
      </article>
    </aside>
  )
}
