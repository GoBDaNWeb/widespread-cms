import { Button, Modal, type ModalComponentProps, Typography } from '@/shared/ui';

import { useLogout } from '../api';

export const LogoutModal = ({ isOpen, close }: ModalComponentProps) => {
	const logout = useLogout();

	const handleLogout = () => {
		logout.mutate(undefined, {
			onSuccess: () => {
				close();
			}
		});
	};

	return (
		<Modal isOpen={isOpen} close={close} className='shadow-primary rounded-2xl p-6'>
			<Typography variant='h3' as='h3' className='mb-6'>
				Are you sure you want to logout?
			</Typography>
			<div className='flex gap-3'>
				<Button
					variant='danger'
					onClick={handleLogout}
					className='flex-1'
					disabled={logout.isPending}
				>
					{logout.isPending ? 'Loading...' : 'Logout'}
				</Button>
				<Button variant='primary' onClick={close} className='flex-1'>
					Close
				</Button>
			</div>
		</Modal>
	);
};
