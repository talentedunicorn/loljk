import { ActionFunction, json, Link, LinksFunction, LoaderFunction, redirect, useActionData } from "remix"
import formStyles from "~/styles/form.css"
import buttonsStyles from "~/styles/buttons.css"
import registerStyles from "~/styles/register.css"
import { createUser, createUserSession, getUserSession } from "~/utils/session.server"
import { db } from "~/utils/db.server"

type ActionData = {
  formError?: string
  fieldsError?: {
    username?: string
    password?: string
  },
  fields?: {
    username?: string
    password?: string
  }
}

export const links: LinksFunction = () => [
  {rel: "stylesheet", href: formStyles},
  {rel: "stylesheet", href: buttonsStyles},
  {rel: "stylesheet", href: registerStyles},
]

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const username = form.get('username') as string
  const password = form.get('password') as string
  const passwordRepeat = form.get('passwordRepeat') as string
  const fields = { username, password }
  const fieldsError = {
    username: await validateUsername(username) || undefined,
    password: validatePassword(password, passwordRepeat) || undefined
  }
  if (Object.values(fieldsError).some(Boolean)) {
    return badRequest({ fields, fieldsError })
  }

  const newUser = await createUser(fields)
  if (!newUser) {
    return badRequest({ formError: `There was an error creating the user. Please try again`})
  }
  return createUserSession(newUser.id, '/jokes')
}

export const loader: LoaderFunction = async ({ request }) => {
  const isLoggedIn = (await getUserSession(request)).get('userId')

  if (isLoggedIn) {
    return redirect('/jokes')
  }
  return null
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

const validateUsername = async (value: string): Promise<string | null> => {
  if (value.trim().length < 1) {
    return `Username is required`
  }
  const userExists = await db.user.findUnique({ where: { username: value }})
  if (userExists) {
    return `User with username ${value} already exists`
  }
  return null
}

const validatePassword = (password: string, repeated: string): string | null => {
  if (password.trim().length < 1) {
    return `Password is required`
  }

  if (password !== repeated) {
    return `Password does not match`
  }
  return null
}

export default function regiterRoute () {
  const actionData = useActionData<ActionData>()
  return (
    <main className="registerPage">
      <h1>Register account</h1>
      <form method="post" className="form">
        <div>
          <label
            htmlFor="username"
            data-error={actionData?.fieldsError?.username}
          >Username</label>
          <input
            type="text"
            id="username"
            name="username"
            defaultValue={actionData?.fields?.username}
            aria-invalid={
              Boolean(actionData?.fieldsError?.username) || undefined
            }
          />
        </div>
        <div>
          <label
            htmlFor="password"
            data-error={actionData?.fieldsError?.password}
          >Password</label>
          <input
            type="password"
            name="password"
            id="password"
            defaultValue={actionData?.fields?.password}
            aria-invalid={
              Boolean(actionData?.fieldsError?.password) || undefined
            }
          />
        </div>
        <div>
          <label htmlFor="passwordRepeat">Repeat password</label>
          <input
            type="password"
            name="passwordRepeat"
            id="passwordRepeat"
          />
        </div>

        <button type="submit" className="button">Submit</button>
        <Link to="/login">Have an account? Log in</Link>
      </form>
    </main>
  )
}
