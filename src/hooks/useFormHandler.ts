import { useEffect, useState } from 'react';

export function useFormHandler<T>(
	initialData: T | null,
	defaultForm: Partial<T>,
	onSubmit: (data: Partial<T>) => Promise<{ code: number; message?: string }>,
	open: boolean,
	transformer?: (form: Partial<T>) => Partial<T>
) {
	const [form, setForm] = useState<Partial<T>>(defaultForm);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	useEffect(() => {
		if (initialData) {
			setForm(initialData);
		} else {
			setForm(defaultForm);
		}
	}, [initialData]);

	useEffect(() => {
		if (!open && !initialData) {
			setForm(defaultForm);
			setErrorMessage(null);
			setSuccessMessage(null);
		}
	}, [open]);

	const handleSubmit = async (onSuccess?: () => void) => {
		try {
			const formToSubmit = transformer ? transformer(form) : form;

			const res = await onSubmit(formToSubmit);
			if (res?.code !== 1) {
				setErrorMessage(res?.message || 'Something went wrong');
				return;
			}

			setSuccessMessage(res?.message || 'Action successful');
			if (typeof onSuccess === 'function') {
				onSuccess();
			}
		} catch (error: any) {
			const message = error?.response?.data?.message || error?.message || 'Something went wrong';
			setErrorMessage(message);
		}
	};

	return {
		form,
		setForm,
		errorMessage,
		setErrorMessage,
		successMessage,
		setSuccessMessage,
		handleSubmit
	};
}
