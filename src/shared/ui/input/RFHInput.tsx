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
};

export const RHFInput = <TFieldValues extends FieldValues>({
	control,
	name,
	rules,
	...props
}: RFHInputProps<TFieldValues>) => {
	const { field, fieldState } = useController({
		name,
		control,
		rules
	});
	return <Input {...field} error={fieldState.error} {...props} />;
};
