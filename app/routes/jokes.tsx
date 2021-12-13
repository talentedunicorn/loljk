import { Outlet, Link } from "remix";

export default function jokesIndex() {
  return (
    <main>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/jokes">View jokes</Link>
        <Link to="new">Create a joke</Link>
      </nav>
      <Outlet />
    </main>
  )
}