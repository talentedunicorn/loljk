import { Link, LinksFunction } from "remix";
import indexStyles from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: indexStyles }]
}

export default function indexRoute() {
  return (
    <main className="indexPage">
      <h1>LOLJK</h1>
      <p>The place for laughs</p>
      <Link to="/jokes">Read jokes</Link>
    </main>
  )
}
