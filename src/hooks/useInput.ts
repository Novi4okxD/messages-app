import React, { useRef, useState } from 'react';

export const useInput = (initialValue?: string) => {
	const [ value, setValue ] = useState<string>(initialValue ?? '');
	const inputRef = useRef<HTMLInputElement | null>(null);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		setValue(target.value);
	};

	const validate = () => {
		if (inputRef.current) {
			inputRef.current?.checkValidity();
		}
	};

	const clear = () => {
		setValue('');
	};

	return {
		props: {
			ref: inputRef,
			value,
			onChange,
		},
		validate,
		clear
	};
};
