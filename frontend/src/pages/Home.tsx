import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import AuthForm from '@/features/auth/AuthForm'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Home = () => {
	const { user } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if (user) {
			navigate('/tasks')
		}
	}, [user, navigate])

	return (
		<motion.div
			className='flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 1, ease: 'easeInOut' }}
		>
			<motion.h1
				className='text-6xl font-bold text-gray-800 dark:text-white mb-8'
				initial={{ y: -50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 1, ease: 'easeInOut' }}
			>
				Добро пожаловать в TaskManager
			</motion.h1>
			<motion.div
				className='p-8 w-full max-w-md'
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 1, ease: 'easeInOut' }}
			>
				<AuthForm />
			</motion.div>
			<motion.div
				className='mt-4'
				initial={{ y: 50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 1, ease: 'easeInOut' }}
			>
				<a
					href='/register'
					className='hover:underline text-gray-800 dark:text-white'
				>
					Зарегистрироваться
				</a>
			</motion.div>
		</motion.div>
	)
}

export default Home
