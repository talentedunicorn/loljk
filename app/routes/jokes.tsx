import { Outlet, Link, LinksFunction, LoaderFunction, useLoaderData } from "remix";
import jokesStyles from "~/styles/jokes.css";
import cardStyles from "~/styles/card.css";
import { Joke } from "@prisma/client";
import { db } from "~/utils/db.server";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: jokesStyles },
    { rel: "stylesheet", href: cardStyles },
  ]
}

type LoaderData = { jokes: Partial<Joke>[] }
export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    jokes: await db.joke.findMany({
      take: 5,
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" }
    })
  }
  return data
}

export default function jokesIndex() {
  const data: LoaderData = useLoaderData<LoaderData>();

  return (
    <main className="jokesPage">
      <nav className="Nav">
        <Link to="/">Home</Link>
        <Link to=".">Random joke</Link>
        <Link to="new">Add joke</Link>
      </nav>
      <section className="Content">
        <div className="container">
          <div className="JokeListWrapper">
            <h2 className="Title">Current jokes</h2>
            {data.jokes && (
              <ul className="JokeList">
                {data.jokes.map((j: Partial<Joke>) => (
                  <li
                    key={j.id}
                  >
                    <Link to={j.id || ''}>{j.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Outlet />
        </div>
      </section>
    </main>
  )
}
