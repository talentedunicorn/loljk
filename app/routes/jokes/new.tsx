import { LinksFunction } from "remix"
import formStyles from "~/styles/form.css"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: formStyles }]
}

export default function newJokeRoute() {
  return (
    <form className="form">
      <h2>Add a funny joke</h2>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" />
      </div>

      <div>
        <label htmlFor="content">Write your joke here</label>
        <textarea id="content" rows={10}></textarea>
      </div>

      <button type="submit">Add joke</button>
    </form>
  )
}
