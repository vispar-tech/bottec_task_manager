export const ErrorDisplay = ({ errors }: { errors: string[] }) => {
	if (errors.length === 0) {
		return null
	}

	return (
		<div className='mb-2 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg'>
			{errors.map((err, index) => (
				<p key={index}>{err}</p>
			))}
		</div>
	)
}
