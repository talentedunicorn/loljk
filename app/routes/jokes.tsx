import { Outlet, Link, LinksFunction } from "remix";
import jokesStyles from "~/styles/jokes.css";
import cardStyles from "~/styles/card.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: jokesStyles },
    { rel: "stylesheet", href: cardStyles },
  ]
}

export default function jokesIndex() {
  return (
    <main className="jokesPage">
      <nav className="Nav">
        <Link to="/">Home</Link>
        <Link to=".">Read jokes</Link>
        <Link to="new">Add joke</Link>
        <Link to="random-joke">Random joke</Link>
      </nav>
      <section className="Content">
        <div className="container">
          <article className="Card">
            <h2 className="CardTitle">Ball</h2>
            <p>
              I was wondering why the ball kept getting
              bigger, then it hit me
            </p>
          </article>
          <Outlet />
        </div>
      </section>
    </main>
  )
}
