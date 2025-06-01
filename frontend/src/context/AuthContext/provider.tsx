import React, { useEffect, useState } from 'react'

import { loginUser, logoutUser, readCurrentUser, registerUser, type UserRead } from '@/api'
import { AuthContext } from './context'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<UserRead | null>(null)
	const [loading, setLoading] = useState(true)

	const fetchUser = async () => {
		setLoading(true)
		try {
			const { data } = await readCurrentUser()
			if (!data) {
				throw new Error('Can`t fetch user')
			}
			setUser(data)
		} catch (error) {
			console.error('Auth error', error)
			setUser(null)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchUser()
	}, [])

	const login = async (email: string, password: string) => {
		const { error } = await loginUser({
			body: {
				email,
				password,
			},
		})
		if (error) {
			return error
		}
		await fetchUser()
	}

	const logout = async () => {
		const { error } = await logoutUser()
		if (error) {
			console.log(error)
			return
		}
		setUser(null)
	}

	const register = async (email: string, password: string, passwordConfirm: string) => {
		const { error } = await registerUser({
			body: {
				email,
				password,
				passwordConfirm,
			},
		})
		if (error) {
			return error
		}
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				logout,
				register,
				isLoading: loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

