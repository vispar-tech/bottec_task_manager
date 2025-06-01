import { useState, useEffect, useCallback, useTransition } from 'react'
import {
	readTasks,
	createTask,
	updateTask,
	deleteTask,
	type TaskOut,
	type PaginatedTaskOut,
	type ReadTasksData,
	type ValidationError,
} from '@/api'
import TaskModal, { type TaskFormValues } from '@/features/tasks/TaskModal'
import { ConfirmModal } from '@/components/shared'
import { useDebounce } from '@/hooks/use-debounce'
import { Filters } from '@/features/tasks/Filters'
import { ErrorDisplay } from '@/features/tasks/ErrorDisplay'
import { TaskList } from '@/features/tasks/TaskList'
import { Pagination } from '@/features/tasks/Pagination'

const Tasks = () => {
	const [response, setResponse] = useState<PaginatedTaskOut | null>(null)
	const [isLoading, startLoading] = useTransition()
	const [errors, setErrors] = useState<string[]>([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editingTask, setEditingTask] = useState<TaskOut | null>(null)
	const [searchTerm, setSearchTerm] = useState('')
	const debouncedSearchTerm = useDebounce(searchTerm, 300)
	const [query, setQuery] = useState<ReadTasksData['query']>({
		sort_by: 'created_at',
		sort_order: 'asc',
		page: 0,
		size: 10,
	})
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
	const [taskToDelete, setTaskToDelete] = useState<TaskOut | null>(null)

	const fetchTasks = useCallback(() => {
		startLoading(async () => {
			setErrors([])
			try {
				const { data, error, status } = await readTasks({
					query: {
						...query,
						page: (query.page | 0) + 1,
					},
				})
				if (error) {
					if (error.detail) {
						const errors: string[] = error.detail.map(err => err.msg)
						setErrors(errors)
					} else {
						setErrors([
							`Ошибка ${
								status ? String(status) : 'неизвестно'
							}: Не удалось загрузить задачу`,
						])
					}
					return
				}
				setResponse(data)
			} catch {
				setErrors(['Произошла ошибка. Попробуйте позже.'])
			}
		})
	}, [query])

	useEffect(() => {
		setQuery(prev => ({
			...prev,
			title: debouncedSearchTerm ? debouncedSearchTerm : undefined,
			page: 0,
		}))
	}, [debouncedSearchTerm])

	useEffect(() => {
		fetchTasks()
	}, [fetchTasks])

	const handleModalSubmit = async (data: TaskFormValues) => {
		try {
			const taskData = {
				title: data.title ?? '',
				description: data.description ?? '',
				isDone: data.isDone ?? false,
			}
			if (editingTask) {
				await updateTask({
					path: { task_id: editingTask.id },
					body: taskData,
					throwOnError: true,
				})
			} else {
				await createTask({
					body: taskData,
					throwOnError: true,
				})
			}
			setIsModalOpen(false)
			setEditingTask(null)
			fetchTasks()
		} catch {
			setErrors(['Ошибка сохранения задачи'])
		}
	}

	const handleDeleteTask = (task: TaskOut) => {
		setTaskToDelete(task)
		setIsConfirmModalOpen(true)
	}

	const handleConfirmDeleteTask = async () => {
		if (!taskToDelete) {
			return
		}
		try {
			await deleteTask({
				path: { task_id: taskToDelete.id },
				throwOnError: true,
			})
			fetchTasks()
		} catch {
			setErrors(['Ошибка удаления задачи'])
		} finally {
			setIsConfirmModalOpen(false)
			setTaskToDelete(null)
		}
	}

	const totalPages = Math.ceil((response?.total ?? 0) / query.size)

	return (
		<div className='flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 py-10'>
			<h1 className='text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8'>
				Ваши задачи
			</h1>
			<div className='w-full max-w-6xl px-2'>
				<Filters
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					query={query}
					setQuery={setQuery}
					onCreateTask={() => {
						setIsModalOpen(true)
					}}
				/>
				<ErrorDisplay errors={errors} />
				<TaskList
					tasks={response?.items ?? []}
					isLoading={isLoading}
					onEdit={task => {
						setEditingTask(task)
						setIsModalOpen(true)
					}}
					onDelete={handleDeleteTask}
				/>
				<Pagination
					query={query}
					setQuery={setQuery}
					totalPages={totalPages}
					isLoading={isLoading}
				/>
				<TaskModal
					isOpen={isModalOpen}
					onClose={() => {
						setIsModalOpen(false)
						setEditingTask(null)
					}}
					onSubmit={handleModalSubmit}
					defaultValues={
						editingTask
							? {
									title: editingTask.title,
									description: editingTask.description,
									isDone: editingTask.isDone,
							  }
							: undefined
					}
				/>
				<ConfirmModal
					isOpen={isConfirmModalOpen}
					onClose={() => {
						setIsConfirmModalOpen(false)
					}}
					onConfirm={handleConfirmDeleteTask}
					title='Подтвердите удаление'
					message={
						taskToDelete
							? `Вы уверены, что хотите удалить задачу "${taskToDelete.title}"? Это действие необратимо.`
							: 'Не установлено'
					}
				/>
			</div>
		</div>
	)
}

export default Tasks
