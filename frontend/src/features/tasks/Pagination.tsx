import type { ReadTasksData } from '@/api'


export const Pagination = ({
	query,
	setQuery,
	totalPages,
	isLoading,
}: {
	query: ReadTasksData['query']
	setQuery: (query: ReadTasksData['query']) => void
	totalPages: number
	isLoading: boolean
}) => {
	if (totalPages <= 1) {
		return null
	}

	return (
		<div
			className='flex justify-center mt-4 space-x-2'
			role='navigation'
			aria-label='Пагинация'
		>
			<button
				onClick={() => {
					setQuery({ ...query, page: Math.max(query.page - 1, 0) })
				}}
				disabled={query.page === 0 || isLoading}
				className='px-3 py-1.5 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors'
				aria-label='Предыдущая страница'
			>
				Назад
			</button>
			<span
				className='px-3 py-1.5 text-gray-800 dark:text-gray-200'
				aria-current='page'
			>
				Страница {(query.page | 0) + 1} из {totalPages}
			</span>
			<button
				onClick={() => {
					setQuery({
						...query,
						page: Math.min((query.page | 0) + 1, totalPages - 1),
					})
				}}
				disabled={query.page === totalPages - 1 || isLoading}
				className='px-3 py-1.5 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors'
				aria-label='Следующая страница'
			>
				Вперед
			</button>
		</div>
	)
}
