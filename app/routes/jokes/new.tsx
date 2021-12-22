import { ActionFunction, Form, json, LinksFunction, redirect, useActionData } from "remix"
import { Joke } from "@prisma/client"
import formStyles from "~/styles/form.css"
import { db } from "~/utils/db.server"
import { requireSession } from "~/utils/session.server";

type ValidationFunction  = (key:string) => string | undefined;
type ActionData = {
  formError?: string;
  fieldErrors?: {
    title: string | undefined;
    content: string | undefined;
  };
  data?: Partial<Joke>
}

const titleValidation: ValidationFunction = (title: string) => {
  if (title.trim().length < 3) {
    return `The title is too short`
  }
}

const contentValidation: ValidationFunction = (content: string) => {
  if (content.trim().length < 10) {
    return `The content is too short`
  }
}

const badRequest = (data: ActionData) =>
  json(data, { status: 400 })

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: formStyles }]
}

export const action: ActionFunction =  async ({ request }) => {
  const form = await request.formData()
  const authorId = await requireSession(request)
  const title = form.get('title')
  const content = form.get('content')

  if (
    typeof title !== "string" ||
    typeof content !== "string"
  ) {
    return badRequest({ formError: `Invalid form values.` })
  }

  const fieldErrors = {
    title: titleValidation(title),
    content: contentValidation(content),
  }
  const data = { title, content, authorId } as Joke
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, data })
  }
  const newJoke: Joke = await db.joke.create({ data })
  return redirect(`/jokes/${newJoke.id}`)
}

export default function newJokeRoute() {
  const actionData = useActionData<ActionData>()
  return (
    <Form className="form" method="post">
      <h2 className="Title">Have a joke to share?</h2>
      <div>
        <label
          htmlFor="title"
          data-error={actionData?.fieldErrors?.title}
          >Title</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={actionData?.data?.title}
          aria-invalid={
            Boolean(actionData?.fieldErrors?.title) || undefined
          }
        />
      </div>

      <div>
        <label
          htmlFor="content"
          data-error={actionData?.fieldErrors?.content}
        >Write your joke here</label>
        <textarea
          id="content"
          name="content"
          rows={10}
          defaultValue={actionData?.data?.content}
          aria-invalid={
            Boolean(actionData?.data?.content) || undefined
          }
          ></textarea>
      </div>

      <button type="submit">Add joke</button>
    </Form>
  )
}
