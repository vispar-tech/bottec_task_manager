import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import { AuthGuard } from './components/guards'
import Tasks from './pages/Tasks'
import Register from './pages/Register'

function App() {
	return (
		<AuthProvider>
			<Router>
				<Header />
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/register' element={<Register />} />
					<Route
						path='/tasks'
						element={
							<AuthGuard>
								<Tasks />
							</AuthGuard>
						}
					/>
				</Routes>
			</Router>
		</AuthProvider>
	)
}

export default App
