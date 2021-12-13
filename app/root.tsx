import { Links, LinksFunction, LiveReload, Outlet } from "remix";
import globalStyles from "~/styles/global.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: globalStyles }]
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Remix: Without DJ Khaleed</title>
        <Links />
      </head>
      <body>
        <Outlet />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}
