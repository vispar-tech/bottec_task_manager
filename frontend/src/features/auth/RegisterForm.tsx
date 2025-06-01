import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { zRegisterUserData } from '@/api/zod.gen'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import type { z } from '@/lib/zod'

export type RegisterFormValues = z.infer<typeof zRegisterUserData>

const RegisterForm = () => {
	const { register, isLoading } = useAuth()
	const navigate = useNavigate()

	const {
		control,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(zRegisterUserData),
		mode: 'onChange',
	})

	const onSubmit = async (data: RegisterFormValues) => {
		const error = await register(
			data.email,
			data.password,
			data.passwordConfirm
		)
		if (error) {
			if (typeof error.detail === 'string') {
				setError('passwordConfirm', { message: error.detail })
			} else {
				setError('passwordConfirm', {
					message: error.detail?.map(e => e.msg).join(', '),
				})
			}
			return
		}
		await navigate('/')
	}

	return (
		<form
			method='post'
			onSubmit={handleSubmit(onSubmit)}
			className='flex flex-col space-y-2 w-full max-w-md p-4'
		>
			<Controller
				name='email'
				control={control}
				render={({ field }) => (
					<input
						type='email'
						id='email'
						disabled={isLoading}
						autoComplete='email'
						placeholder='Почта'
						{...field}
						className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
					/>
				)}
			/>
			{errors.email && (
				<p className='text-red-500 text-sm '>{errors.email.message}</p>
			)}
			<Controller
				name='password'
				control={control}
				render={({ field }) => (
					<input
						type='password'
						id='password'
						autoComplete='new-password'
						disabled={isLoading}
						placeholder='Пароль'
						{...field}
						className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
					/>
				)}
			/>
			{errors.password && (
				<p className='text-red-500 text-sm '>{errors.password.message}</p>
			)}
			<Controller
				name='passwordConfirm'
				control={control}
				render={({ field }) => (
					<input
						type='password'
						id='passwordConfirm'
						autoComplete='new-password'
						disabled={isLoading}
						placeholder='Повторите пароль'
						{...field}
						className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
					/>
				)}
			/>
			{errors.passwordConfirm && (
				<p className='text-red-500 text-sm '>
					{errors.passwordConfirm.message}
				</p>
			)}
			<button
				type='submit'
				disabled={isLoading}
				className='w-full py-2 rounded-lg bg-blue-500 text-white hover:opacity-80 transition-colors'
			>
				Зарегистрироваться
			</button>
		</form>
	)
}

export default RegisterForm
