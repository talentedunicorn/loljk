import { Outlet, Link, LinksFunction, LoaderFunction, useLoaderData } from "remix";
import jokesStyles from "~/styles/jokes.css";
import cardStyles from "~/styles/card.css";
import buttonsStyles from "~/styles/buttons.css";
import { Joke, User } from "@prisma/client";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: jokesStyles },
    { rel: "stylesheet", href: cardStyles },
    { rel: "stylesheet", href: buttonsStyles },
  ]
}

type LoaderData = { jokes: Partial<Joke>[], author: User | null }
export const loader: LoaderFunction = async ({ request }) => {
  const data: LoaderData = {
    author: await getUser(request),
    jokes: await db.joke.findMany({
      take: 5,
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" }
    })
  }

  if (!data.jokes.length) {
    return new Response("No jokes found", { status: 404 })
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
          <header className="UserControls">
            Welcome { data.author?.username }

            <form action="/logout" method="post">
              <button type="submit" className="button">Logout</button>
            </form>
          </header>
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
