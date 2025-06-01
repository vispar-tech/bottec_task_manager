import type { TaskOut } from '@/api'


export const TaskList = ({
	tasks,
	isLoading,
	onEdit,
	onDelete,
}: {
	tasks: TaskOut[]
	isLoading: boolean
	onEdit: (task: TaskOut) => void
	onDelete: (task: TaskOut) => void
}) => {
	if (isLoading) {
		return (
			<div className='flex justify-center items-center py-4'>
				<div className='loading-container'>
					<div className='loading-spinner'></div>
				</div>
			</div>
		)
	}

	if (tasks.length === 0) {
		return (
			<div className='text-center text-gray-800 dark:text-gray-200 mt-4'>
				Задачи не найдены
			</div>
		)
	}

	return (
		<div className='overflow-x-auto shadow-lg rounded-lg'>
			<table
				className='w-full bg-white dark:bg-gray-800'
				aria-label='Список задач'
			>
				<thead className='bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'>
					<tr>
						<th className='py-2 px-3 text-left sticky top-0 bg-gray-200 dark:bg-gray-700'>
							ID
						</th>
						<th className='py-2 px-3 text-left sticky top-0 bg-gray-200 dark:bg-gray-700'>
							Заголовок
						</th>
						<th className='py-2 px-3 text-left sticky top-0 bg-gray-200 dark:bg-gray-700'>
							Описание
						</th>
						<th className='py-2 px-3 text-left sticky top-0 bg-gray-200 dark:bg-gray-700'>
							Статус
						</th>
						<th className='py-2 px-3 text-left sticky top-0 bg-gray-200 dark:bg-gray-700'>
							Создано
						</th>
						<th className='py-2 px-3 text-left sticky top-0 bg-gray-200 dark:bg-gray-700'>
							Действия
						</th>
					</tr>
				</thead>
				<tbody>
					{tasks.map(task => (
						<tr
							key={task.id}
							className='border-t dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
						>
							<td className='py-2 px-3'>{task.id}</td>
							<td className='py-2 px-3'>{task.title}</td>
							<td className='py-2 px-3'>{task.description}</td>
							<td className='py-2 px-3'>
								<span
									className={`${
										task.isDone ? 'text-green-500' : 'text-red-500'
									} font-medium`}
								>
									{task.isDone ? 'Выполнено' : 'Не выполнено'}
								</span>
							</td>
							<td className='py-2 px-3'>
								{new Date(task.createdAt).toLocaleString('ru-RU', {
									dateStyle: 'short',
									timeStyle: 'short',
								})}
							</td>
							<td className='py-2 px-3 flex space-x-2'>
								<button
									onClick={() => {
										onEdit(task)
									}}
									className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm'
									disabled={isLoading}
									aria-label={`Редактировать задачу ${task.title}`}
								>
									Редактировать
								</button>
								<button
									onClick={() => {
										onDelete(task)
									}}
									className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 text-sm'
									disabled={isLoading}
									aria-label={`Удалить задачу ${task.title}`}
								>
									Удалить
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
