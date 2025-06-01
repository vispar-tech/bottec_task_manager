import type { ReadTasksData } from '@/api'


export const Filters = ({
	searchTerm,
	setSearchTerm,
	query,
	setQuery,
	onCreateTask
}: {
	searchTerm: string
	setSearchTerm: (value: string) => void
	query: ReadTasksData['query']
	setQuery: (query: ReadTasksData['query']) => void
	onCreateTask: () => void

}) => {
	return (
		<div className='flex flex-col sm:flex-row justify-between mb-4 space-y-1 sm:space-y-0 sm:space-x-2'>
			<div className='flex space-x-2'>
			<input
				type='text'
				placeholder='Поиск задач'
				value={searchTerm}
				onChange={e => {
					setSearchTerm(e.target.value)
				}}
				className='px-3 py-1.5 border rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
				
				aria-label='Поиск задач'
			/>
			<select
				value={
					query.is_done === true
						? 'true'
						: query.is_done === false
						? 'false'
						: 'all'
				}
				onChange={e => {
					setQuery({
						...query,
						is_done:
							e.target.value === 'all' ? undefined : e.target.value === 'true',
						page: 0,
					})
				}}
				className='px-3 py-1.5 border rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
				
				aria-label='Фильтр по статусу'
			>
				<option value='all'>Все</option>
				<option value='true'>Выполненные</option>
				<option value='false'>Невыполненные</option>
			</select>
			<select
				value={query.sort_order ?? 'desc'}
				onChange={e => {
					setQuery({
						...query,
						sort_order: e.target.value === 'asc' ? 'asc' : 'desc',
						page: 0,
					})
				}}
				className='px-3 py-1.5 border rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
				
				aria-label='Порядок сортировки'
			>
				<option value='asc'>Сначала старые</option>
				<option value='desc'>Сначала новые</option>
			</select>
			</div>
			<button
				onClick={() => {onCreateTask();}}
				className='px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors disabled:opacity-50 text-base'
				
				aria-label='Создать задачу'
			>
				Создать задачу
			</button>
		</div>
	)
}
