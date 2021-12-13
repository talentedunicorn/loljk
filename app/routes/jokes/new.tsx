export default function newJokeRoute() {
  return (
    <form>
      <p>Add a funny joke</p>
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" />
      </div>

      <div>
        <label htmlFor="content">Content</label>
        <textarea id="content"></textarea>
      </div>

      <button type="submit">Add joke</button>
    </form>
  )
}