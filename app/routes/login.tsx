import { ActionFunction, json, LinksFunction, useActionData, useSearchParams, Link, redirect, LoaderFunction } from "remix"
import { login, createUserSession, getUserSession } from "~/utils/session.server"
import formStyles from "~/styles/form.css"
import buttonsStyles from "~/styles/buttons.css"
import loginStyles from "~/styles/login.css"

type ActionData = {
  formError?: string
  fieldErrors?: {
    username: string | undefined
    password: string | undefined
  }
  fields?: any
}

export const links: LinksFunction = () => {
  return [
    {rel: "stylesheet", href: loginStyles },
    {rel: "stylesheet", href: formStyles },
    {rel: "stylesheet", href: buttonsStyles },
  ]
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const username = form.get('username') as string
  const password = form.get('password') as string
  const redirectTo = form.get('redirectTo') as string || '/jokes'
  const fields = { username, password, redirectTo }
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password)
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields })
  }

  // Log in
  if (username && password) {
    const user = await login(fields)
    if (!user) {
      return badRequest({
        fields,
        formError: `Username or password is incorrect`
      })
    }
    return createUserSession(user.id, fields.redirectTo)
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const isLoggedIn = (await getUserSession(request)).get('userId')

  // TODO: Check if logged in and redirect
  if (isLoggedIn) {
    return redirect('/jokes')
  }
  return null
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

const validateUsername = (value: unknown) => {
  if (typeof value !== "string" || value.length < 3) {
    return `Username must be atleast 3 characters long`
  }
}

const validatePassword = (value: unknown) => {
  if (typeof value !== "string" || value.length < 6) {
    return `Password must be atleast 6 characters long`
  }
}

export default function LoginRoute() {
  const actionData = useActionData<ActionData>()
  const [searchParams] = useSearchParams()
  return (
    <main className="loginPage">
      <Link to="/" className="back">Go back</Link>
      <form method="post" className="form">
        {actionData?.formError && <span className="error">{ actionData.formError }</span>}
        <input type="hidden" name="redirectTo" value={ searchParams.get("redirectTo") ?? undefined } />
        <div>
          <label
            htmlFor="username"
            data-error={actionData?.fieldErrors?.username}
          >Username</label>
          <input
            type="text"
            id="username"
            name="username"
            defaultValue={actionData?.fields?.username}
            aria-invalid={
              Boolean(actionData?.fieldErrors?.username) || undefined
            }
          />
        </div>
        <div>
          <label
            htmlFor="password"
            data-error={actionData?.fieldErrors?.password}
          >Password</label>
          <input
            type="password"
            id="password"
            name="password"
            defaultValue={actionData?.fields?.password}
            aria-invalid={
              Boolean(actionData?.fieldErrors?.password) || undefined
            }
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </main>
  )
}
