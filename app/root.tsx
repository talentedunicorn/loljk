import { LiveReload } from "remix";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Remix: Without DJ Khaleed</title>
      </head>
      <body>
        Ello, Remix!
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}