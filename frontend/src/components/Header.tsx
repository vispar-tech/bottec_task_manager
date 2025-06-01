import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
	const { user, isLoading, logout } = useAuth()
	const navigate = useNavigate()

	const handleLogout = () => {
		logout()
			.then(() => navigate('/'))
			.catch(console.error)
	}

	if (isLoading) {
		return null
	}

	return (
		<header className='p-2 flex justify-end items-center fixed top-0 w-full'>
			{user && (
				<button
					onClick={handleLogout}
					className='px-3 py-1 bg-red-600 text-white rounded-lg'
				>
					Выйти
				</button>
			)}
		</header>
	)
}

export default Header
