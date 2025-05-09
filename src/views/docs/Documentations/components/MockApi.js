import React from 'react'
import { SyntaxHighlighter } from 'components/shared'

const MockApi = () => {
	return (
		<>
			<p>Elstar uses <a href="https://miragejs.com/" target="_blank" rel="noreferrer">miragejs</a> for mocking API calls, all the api interaction in our demo are work under miragejs.</p>
			<div className="mt-10" id="disableMockApi">
				<h5>Enable mock api</h5>
				<p className="mt-1">
					Mock api was disabled by default in our starter-kit, you can turn in on via setting <code>enableMock</code> field to true in <code>src/configs/app.config.js</code>
				</p>
				<SyntaxHighlighter language="js">{`const appConfig = {
    ...,
    enableMock: true
}`}</SyntaxHighlighter>
			</div>
			<div className="mt-10" id="usingMockApi">
				<h5>Using mock api</h5>
				<p className="mt-1">
					If you have intent to use mock api, you can follow the steps below to create a fake db data & api
				</p>
				<ol>
					<li>
						<strong>Setup</strong>
						<p className="mt-1">Visit <code>src/mock/index.js</code>, and here is the overall configuration of mirage</p>
						<SyntaxHighlighter language="js">{`export default function mockServer({ environment = 'test' }) {
	return createServer({
		environment,
		seeds(server) {
			server.db.loadData({
				...
			})
		},
		routes() {
			...
		},
	})
}`}</SyntaxHighlighter>
					</li>
					<li>
						<strong>Add static data</strong>
						<p className="mt-1">Now we can add some data to the fake db</p>
						<SyntaxHighlighter language="js">{`return createServer({
		environment,
		seeds(server) {
			server.db.loadData({
				usersData: [
					{
						id: '1',
						name: 'Carolyn Perkins',
					},
					{
						id: '2',
						name: 'Terrance Moreno',
					},
					{
						id: '3',
						name: 'Ron Vargas',
					},
				]
			})
		},
		...
	})
}`}</SyntaxHighlighter>
					</li>
					<li>
						<strong>Create mock api</strong>
						<p className="mt-1">Created a mock api under route</p>
						<SyntaxHighlighter language="js">{`return createServer({
		...
		routes() {
			this.get('api/getUsers', schema => schema.db.usersData)
		},
})`}</SyntaxHighlighter>
					</li>
				</ol>
			</div>
			<div>
				<p>And now you can make request to this api & get the static data just setted above as response</p>
				<SyntaxHighlighter language="js">{`// service
import ApiService from "./ApiService"

export async function apiGetUser () {
    return ApiService.fetchData({
        url: '/api/getUsers',
        method: 'get'
    })
}`}</SyntaxHighlighter>
				<SyntaxHighlighter language="js">{`// component
import { useEffect } from 'react'
import { apiGetUser } from './YourService.js'

const YourComponent = props => {

	const fetchData = async () => {
		try {
			const resp = await apiGetUser()
			console.log(resp.data)
		} catch (errors) {
			...handle errors
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	return (
		...
	)
}`}</SyntaxHighlighter>
			</div>
		</>
	)
}

export default MockApi