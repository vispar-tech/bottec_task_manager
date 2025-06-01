import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface ModalOverlayProps {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
}

export const ModalOverlay: React.FC<ModalOverlayProps> = ({
	isOpen,
	onClose,
	children,
}) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center'
					onClick={onClose}
				>
					<motion.div
						initial={{ y: -50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -50, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className='bg-white dark:bg-gray-800 p-4 rounded-lg'
						onClick={e => {
							e.stopPropagation()
						}}
					>
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
