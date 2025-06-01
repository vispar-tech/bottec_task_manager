import { useAuth } from '@/context/AuthContext'
import React from 'react'
import { Navigate } from 'react-router-dom'

interface AuthGuardProps {
	children: React.ReactNode
}

const AuthGuard = ({ children }: AuthGuardProps) => {
	const { user, isLoading } = useAuth()

	if ( isLoading) {
		return (
			<div className='text-center text-gray-800 dark:text-gray-200'>
				Загрузка...
			</div>
		)
	}

	if (!user) {
		return <Navigate to='/' />
	}

	return children
}

export default AuthGuard
