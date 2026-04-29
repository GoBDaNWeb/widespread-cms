import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import axios from 'axios';

import { type IUserCredentials } from '@/entities/user';

import { Button, RHFInput, Typography } from '@/shared/ui';

import { useLogin } from '../model';

export const AuthForm = () => {
	const login = useLogin();
	const { handleSubmit, control, watch } = useForm<IUserCredentials>();

	const username = watch('username');
	const password = watch('password');

	const onSubmit = ({ username, password }: IUserCredentials) => {
		login.mutate({
			username,
			password
		});
	};

	useEffect(() => {
		if (login.error) {
			login.reset();
		}
	}, [username, password]);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='shadow-primary bg-surface flex-center min-w-125 flex-col rounded-2xl p-6'
		>
			<Typography variant='h1' as='h1' className='mb-4'>
				Widespread CMS
			</Typography>
			<div className='mb-7 flex w-full flex-col gap-5'>
				<RHFInput
					placeholder='Username'
					control={control}
					name='username'
					rules={{ required: 'Username is required' }}
				/>
				<RHFInput
					placeholder='Password'
					control={control}
					name='password'
					type='password'
					rules={{ required: 'Password is required' }}
				/>
			</div>

			{axios.isAxiosError(login.error) && (
				<Typography variant='small' as='small' className='mb-4'>
					{login.error.response?.data?.detail}
				</Typography>
			)}
			<Button variant='primary' type='submit' className='w-full'>
				Submit
			</Button>
		</form>
	);
};
