import { Outlet, LinksFunction, LoaderFunction, useLoaderData, NavLink } from "remix";
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
  type NavItem = { path: string, label: string }
  const navs: NavItem[] = [
    {
      path: '/',
      label: 'Home'
    },
    {
      path: '.',
      label: 'Jokes'
    },
    {
      path: 'new',
      label: 'Add joke'
    }
  ];

  return (
    <main className="jokesPage">
      <nav className="Nav">
        {navs.map((link: NavItem) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => 
              isActive ? 'active' : ''
            }
            end
          >{link.label}</NavLink>
        ))}
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
              <ul className="JokeList Card">
                {data.jokes.map((j: Partial<Joke>) => (
                  <li
                    key={j.id}
                  >
                    <NavLink 
                      to={j.id || ''}
                      className={({ isActive }) => isActive ? 'active' : ''}
                    >{j.title}</NavLink>
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
