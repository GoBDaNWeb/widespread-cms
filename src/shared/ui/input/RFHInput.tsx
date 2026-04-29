import type { ComponentProps } from 'react';
import {
	// Control — тип "контроллера" формы, который возвращает useForm().
	type Control,
	// FieldValues — базовый тип для значений формы (объект с полями).
	type FieldValues,
	// Path — тип "пути" до поля формы (например "username" или "user.email").
	type Path,
	// RegisterOptions — тип правил валидации (required, minLength и т.д.).
	type RegisterOptions,
	// useController — хук RHF для подключения controlled-компонента к форме.
	// Он возвращает:
	// - field: { name, value, onChange, onBlur, ref }
	// - fieldState: { error, isTouched, isDirty, ... }
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
