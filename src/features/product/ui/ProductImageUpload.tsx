import { useRef } from 'react';
import { IoClose } from 'react-icons/io5';

import { type PendingImage } from '@/entities/image';

import { API_URL } from '@/shared/config';
import { useUploadImage } from '@/shared/lib';
import { Button, Spinner } from '@/shared/ui';

interface Props {
	images: PendingImage[];
	onChange: (images: PendingImage[]) => void;
}

export const ProductImageUpload = ({ images, onChange }: Props) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const { mutateAsync: upload, isPending } = useUploadImage();

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? []);
		if (!files.length) return;

		const results = await Promise.all(
			files.map(async file => {
				const { url } = await upload(file);
				return { url, alt: '', localId: crypto.randomUUID() } satisfies PendingImage;
			})
		);

		onChange([...images, ...results]);
		e.target.value = '';
	};

	const handleRemove = (localId: string | number) => {
		onChange(images.filter(img => img.localId !== localId));
	};

	return (
		<div className='flex flex-col gap-3'>
			<input
				ref={inputRef}
				type='file'
				accept='image/*'
				multiple
				className='hidden'
				onChange={handleFileChange}
			/>
			<Button
				type='button'
				onClick={() => inputRef.current?.click()}
				disabled={isPending}
				className='w-full'
			>
				{isPending ? <Spinner /> : 'Add photos'}
			</Button>
			{images.length > 0 && (
				<div className='grid grid-cols-3 gap-2'>
					{images.map(img => (
						<div key={img.localId} className='relative aspect-square'>
							<img
								src={img.url ? `${API_URL}${img.url}` : 'nophoto.png'}
								alt={img.alt}
								className='h-full w-full rounded-lg object-cover'
							/>
							<Button
								type='button'
								variant='unstyled'
								onClick={() => handleRemove(img.localId)}
								className='absolute top-1 right-1 h-6 w-6 bg-black/60 p-0 text-white hover:bg-black/80'
							>
								<IoClose />
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
