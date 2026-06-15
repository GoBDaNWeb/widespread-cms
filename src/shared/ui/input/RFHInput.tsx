import type { ComponentProps } from 'react';
import {
	type Control,
	type FieldValues,
	type Path,
	type RegisterOptions,
	useController
} from 'react-hook-form';

import { Input } from './Input';

type BaseInputProps = ComponentProps<typeof Input>;

type RFHInputProps<TFieldValues extends FieldValues> = Omit<
	BaseInputProps,
	'name' | 'defaultValue' | 'value' | 'onChange' | 'onBlur'
> & {
	name: Path<TFieldValues>;
	control: Control<TFieldValues>;
	rules?: RegisterOptions<TFieldValues>;
	readonly?: boolean;
};

export const RHFInput = <TFieldValues extends FieldValues>({
	control,
	name,
	rules,
	mask,
	unmask,
	readonly,
	...props
}: RFHInputProps<TFieldValues>) => {
	const { field, fieldState } = useController({ name, control, rules });

	if (mask) {
		return (
			<Input
				{...props}
				ref={field.ref}
				mask={mask}
				unmask={unmask}
				value={field.value != null ? String(field.value) : ''}
				onChange={field.onChange}
				onBlur={field.onBlur}
				name={field.name}
				error={fieldState.error}
			/>
		);
	}

	return <Input {...field} value={field.value ?? ''} error={fieldState.error} {...props} />;
};
