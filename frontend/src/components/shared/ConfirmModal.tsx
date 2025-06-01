import React from 'react'
import { ModalOverlay } from '@/components/shared/ModalOverlay'

interface ConfirmModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title: string
	message: string
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
}) => {
	return (
		<ModalOverlay isOpen={isOpen} onClose={onClose}>
			<h2 className='text-xl font-bold mb-2 text-gray-800 dark:text-gray-200'>
				{title}
			</h2>
			<p className='text-gray-700 dark:text-gray-200'>{message}</p>
			<div className='mt-4 flex justify-end space-x-2'>
				<button
					className='px-2.5 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition'
					onClick={onClose}
				>
					Отмена
				</button>
				<button
					className='px-2.5 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'
					onClick={onConfirm}
				>
					Удалить
				</button>
			</div>
		</ModalOverlay>
	)
}
