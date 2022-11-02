import React from 'react'
import { SyntaxHighlighter } from 'components/shared'

const Authentication = () => {
	return (
		<>
			<p>Elstar provides an implementation for JWT authorization that allows you to quickly link up your backend services.</p>
			<p>
				We are using <code>localStorage</code> & Redux to store tokens info and authenticate the user. 
				As we mentioned in our <strong>Redux guide</strong>, we use <a href="https://github.com/rt2zz/redux-persist" target="_blank" rel="noreferrer">redux-persist</a> to
				maintain localStorage synchronize with some of our Redux state.
			</p>
			<p>Let's take a look at the example we have in the demo</p>
			<p>We created a series of authentication services under <code>src/services/AuthService.js</code></p>
			<SyntaxHighlighter language="js">{`import ApiService from "./ApiService"

export async function apiSignIn (data) {
    return ApiService.fetchData({
        url: '/sign-in',
        method: 'post',
        data
    })
}

export async function apiSignUp (data) {
    return ApiService.fetchData({
        url: '/sign-up',
        method: 'post',
        data
    })
}

...`}</SyntaxHighlighter>
			<p>Sign in implementation example:</p>
			<SyntaxHighlighter language="js">{`import { onSignInSuccess } from 'store/auth/sessionSlice'
import { setUser } from 'store/auth/userSlice'
import { apiSignIn } from 'services/AuthService'
import appConfig from 'configs/app.config'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import { useDispatch } from 'react-redux'

const SignInForm = props => {

	const dispatch = useDispatch()

	const navigate = useNavigate()

	const [message, setMessage] = useTimeOutMessage()

	const onSignIn = async (values, setSubmitting) => {
		const { userName, password } = values
		setSubmitting(true)
		try {
			const resp = await apiSignIn({ userName, password })
			if (resp.data) {
				setSubmitting(false)
				const { token } = resp.data
				// This will set the returning token to redux & localStorage
				dispatch(onSignInSuccess(token))
				// You can also set the user info to redux here, if it comes along with your sign in api 
				if(resp.data.user) {
					dispatch(setUser(resp.data.user || { 
						avatar: '', 
						userName: 'Anonymous', 
						authority: ['USER'], 
						email: ''
					}))
				}
				navigate(appConfig.authenticatedEntryPath)
			}
		} catch (errors) {
			setMessage(errors?.response?.data?.message || errors.toString())
			setSubmitting(false)
		}
	}

	return (
		<Formik
			onSubmit={(values, { setSubmitting }) => {
				onSignIn(values, setSubmitting)
			}}
			...
		>
		...
	)
`}</SyntaxHighlighter>
			<p>You can also use composed <code>signIn</code> function propvided by our <code>useAuth</code> hooks, located at <code>src/utils/hooks/useAuth.js</code></p>
			<div className="mt-10" id="overview">
				<h5>Overview</h5>
				<p>
					Once your backend API was ready integrate, you can config the API endpoints at 
					<code>src/services/AuthService.js</code> and edit the implementation at
					<code>src/views/auth/*/xxxForm.js</code> & <code>src/store/auth/*.js</code> based 
					on your application needed.
				</p>
			</div>
		</>
	)
}

export default Authentication