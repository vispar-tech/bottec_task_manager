import type {
	HttpValidationError,
	InvalidCredentialsResponse,
	UserRead,
} from '@/api'
import { createContext } from 'react'

// Move here cause react-refresh warn

export interface AuthContextType {
	user: UserRead | null
	login: (
		email: string,
		password: string
	) => Promise<InvalidCredentialsResponse | HttpValidationError | undefined>
	register: (
		email: string,
		password: string,
		passwordConfirm: string
	) => Promise<HttpValidationError | undefined>
	logout: () => Promise<void>
	isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)
