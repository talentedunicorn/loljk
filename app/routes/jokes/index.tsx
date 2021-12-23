import { Link, LoaderFunction, useCatch, useLoaderData } from "remix"
import { Joke } from "@prisma/client";
import { db } from "~/utils/db.server"

export const loader: LoaderFunction = async () => {
  const count = await db.joke.count();
  const randomNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomNumber
  })
  
  if (!randomJoke) {
    throw new Response("No random joke found.", { status: 404 })
  }
  return randomJoke
}

export const CatchBoundary = () => {
  const caught = useCatch();
  
  if (caught.status === 404) {
    return (
      <div className="error">
        { caught.data }
      </div>
    )
  }

  throw new Error(`Unexpected error: ${caught.status}`);
} 

export const ErrorBoundary = () => {
  return (
    <div className="error">
      <p>Opps! Something unpleasant happened. <Link to=".">Retry</Link></p>
    </div>
  )
}


export default function jokeIndex() {
  const data: Joke = useLoaderData<Joke>()
  return (
    <aside>
      <h2 className="Title">Here's a random joke</h2>
      <article>
        <h3 className="CardTitle">{data.title}</h3>
        <p>{data.content}</p>
        <Link to={`/jokes/${data.id}`}>Permalink</Link>
      </article>
    </aside>
  )
}
