import styled from 'styled-components';

interface IStyledInputProps {
	type?: string;
	initialValue?: string;
	placeholder?: string;
}

export const Input = styled.input.attrs(props => ({
	...props,
	type: props.type ?? 'text'
}))<IStyledInputProps>`
	background: var(--color-default-active-background);
	border-radius: 8px;
	padding: 8px 12px;
	outline: none;
	font-family: var(--font-family);
	font-size: 16px;
	line-height: 20px;
	border: none;
	
	&:focus {
		box-shadow: 0 0 0 1px var(--color-accent);
		
		&:invalid {
			box-shadow: 0 0 0 1px red;
		}
	}
`;
