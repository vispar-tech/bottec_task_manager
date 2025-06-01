import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { zLoginUserData } from '@/api/zod.gen'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import type { z } from '@/lib/zod'

export type AuthFormValues = z.infer<typeof zLoginUserData>

const AuthForm = () => {
	const { login, isLoading } = useAuth()
	const navigate = useNavigate()
	const [showPassword, setShowPassword] = useState(false)

	const {
		control,
		handleSubmit,
		formState: { errors },
		trigger,
		setError,
	} = useForm<AuthFormValues>({
		resolver: zodResolver(zLoginUserData),
		mode: 'onChange',
	})

	const onSubmit = async (data: AuthFormValues) => {
		const error = await login(data.email, data.password)
		if (error) {
			if (typeof error.detail === 'string') {
				setError('password', { message: error.detail })
			} else {
				setError('password', {
					message: error.detail?.map(e => e.msg).join(', '),
				})
			}
			return
		}
		await navigate('/tasks')
	}

	const handleNext = async (event: React.FormEvent) => {
		event.preventDefault()
		const isValid = await trigger('email')
		if (isValid) {
			setShowPassword(true)
		}
	}

	return (
		<form
			method='post'
			onSubmit={showPassword ? handleSubmit(onSubmit) : handleNext}
			className='flex flex-col space-y-2 w-full max-w-md p-4'
		>
			<Controller
				name='email'
				control={control}
				render={({ field }) => (
					<div className='flex flex-col '>
						<input
							type='email'
							id='email'
							disabled={isLoading}
							autoComplete='email'
							placeholder='Email'
							{...field}
							className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
						/>
						{errors.email && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.email.message}
							</p>
						)}
					</div>
				)}
			/>
			{showPassword && (
				<Controller
					name='password'
					control={control}
					render={({ field }) => (
						<div className='flex flex-col '>
							<input
								type='password'
								id='password'
								autoFocus
								autoComplete='current-password'
								disabled={isLoading}
								placeholder='Пароль'
								{...field}
								className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
							/>
							{errors.password && (
								<p className='text-red-500 text-sm mt-1'>
									{errors.password.message}
								</p>
							)}
						</div>
					)}
				/>
			)}
			<button
				type={'submit'}
				disabled={isLoading}
				className={`w-full py-2 rounded-lg ${
					showPassword ? 'bg-green-500' : 'bg-blue-500'
				} text-white hover:opacity-80 transition-colors`}
			>
				{showPassword ? 'Войти' : 'Далее'}
			</button>
		</form>
	)
}

export default AuthForm
