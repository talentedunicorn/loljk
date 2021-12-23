import { User } from "@prisma/client";
import { Link, LinksFunction, LoaderFunction, useLoaderData } from "remix";
import indexStyles from "~/styles/index.css";
import { getUserSession } from "~/utils/session.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: indexStyles }]
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserSession(request)
  const userId = user.get('userId')
  if (userId) {
    return true
  }
  return false
}

export default function indexRoute() {
  const user = useLoaderData<Boolean>()
  return (
    <main className="indexPage">
      <h1>LOLJK</h1>
      <p>The place for laughs</p>
      <div className="Links">
        {user ? (
          <Link to="/jokes">Read jokes</Link>
        ):
        (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Get started</Link>
          </>
        )}
      </div>
    </main>
  )
}
