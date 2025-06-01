import React from 'react'
import {
	Controller,
	useForm,
	type SubmitHandler,
	type UseFormProps,
	type UseFormReturn,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { zTaskCreate, zTaskUpdate } from '@/api/zod.gen'
import { z } from '@/lib/zod'
import { ModalOverlay } from '@/components/shared/ModalOverlay'

interface TaskModalProps {
	isOpen: boolean
	onClose: () => void
	onSubmit: (data: TaskFormValues) => void
	defaultValues?: TaskFormValues
}

interface TaskModalContentProps {
	onClose: () => void
	onSubmit: (data: TaskFormValues) => void
	defaultValues?: TaskFormValues
}

export type TaskFormValues = z.infer<typeof zTaskUpdate>

const TaskModalContent: React.FC<TaskModalContentProps> = ({
	onClose,
	onSubmit,
	defaultValues,
}) => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	}: UseFormReturn<TaskFormValues, UseFormProps<TaskFormValues>> = useForm({
		resolver: zodResolver(defaultValues ? zTaskUpdate : zTaskCreate),
		defaultValues: {
			title: defaultValues?.title ?? '',
			description: defaultValues?.description ?? '',
			isDone: defaultValues?.isDone ?? false,
		},
	})

	const submitHandler: SubmitHandler<TaskFormValues> = data => {
		onSubmit(data)
		reset()
	}

	return (
		<form onSubmit={handleSubmit(submitHandler)} className='min-w-sm'>
			<h2 className='text-xl font-bold mb-2 text-gray-800 dark:text-gray-200'>
				{defaultValues ? 'Редактировать задачу' : 'Создать задачу'}
			</h2>
			<div className='mb-2'>
				<label className='block text-gray-700 dark:text-gray-300'>
					Заголовок
				</label>
				<Controller
					name='title'
					control={control}
					render={({ field }) => (
						<input
							type='text'
							{...field}
							value={field.value ?? ''}
							className='w-full px-3 py-1.5 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					)}
				/>
				{errors.title && (
					<p className='text-red-500 mt-0.5 text-sm'>{errors.title.message}</p>
				)}
			</div>
			<div className='mb-2'>
				<label className='block text-gray-700 dark:text-gray-300'>
					Описание
				</label>
				<Controller
					name='description'
					control={control}
					render={({ field }) => (
						<textarea
							{...field}
							value={field.value ?? ''}
							className='w-full px-3 py-1.5 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
						></textarea>
					)}
				/>
				{errors.description && (
					<p className='text-red-500 mt-0.5 text-sm'>
						{errors.description.message}
					</p>
				)}
			</div>
			{defaultValues && (
				<div className='mb-2'>
					<Controller
						name='isDone'
						control={control}
						render={({ field }) => (
							<label className='flex items-center'>
								<input
									type='checkbox'
									checked={field.value ?? false}
									onChange={field.onChange}
									className='mr-2'
								/>
								<span className='text-gray-700 dark:text-gray-300'>
									Выполнено
								</span>
							</label>
						)}
					/>
				</div>
			)}
			<div className='flex justify-end space-x-2'>
				<button
					type='button'
					onClick={onClose}
					className='px-2.5 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition'
				>
					Отмена
				</button>
				<button
					type='submit'
					className='px-2.5 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
				>
					{defaultValues ? 'Обновить' : 'Создать'}
				</button>
			</div>
		</form>
	)
}

const TaskModal: React.FC<TaskModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	defaultValues,
}) => {
	return (
		<ModalOverlay isOpen={isOpen} onClose={onClose}>
			<TaskModalContent onClose={onClose} onSubmit={onSubmit} defaultValues={defaultValues} />
		</ModalOverlay>
	)
}

export default TaskModal

