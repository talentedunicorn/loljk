import { Joke } from "@prisma/client"
import { Link, LoaderFunction, useLoaderData } from "remix"
import { db } from "~/utils/db.server"

export const loader: LoaderFunction = async ({ params }) => {
  const data: Joke | null = await db.joke.findUnique({ where: { id: params.jokeId }})
  return data
}

export default function jokeRoute() {
  const data: Joke = useLoaderData<Joke>()
  return (
    <article>
      <h2 className="CardTitle">{data.title}</h2>
      <p>{data.content}</p>

      <Link to=".">Permalink</Link>
    </article>
  )
}
