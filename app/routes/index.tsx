import { Link } from "remix";

export default function indexRoute() {
  return (
    <main>
      <h1>LOLJK</h1>
      <Link to="/jokes">Checkout the jokes</Link>
    </main>
  )
}