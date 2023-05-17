import styled, { css } from 'styled-components';

interface IButtonProps {
	readonly $rounded?: boolean;
	readonly $accent?: boolean;
	readonly $danger?: boolean;
	type?: string;
}

export const Button = styled.button.attrs(props => ({
	...props,
	type: props.type ?? 'button'
}))<IButtonProps>`
	border: none;
	padding: 8px 16px;
	background: var(--color-default-active-background);
	font-family: var(--font-family);
	font-size: 16px;
	line-height: 20px;
	color: #fff;
	cursor: pointer;
	
	${
		({ $rounded }) => $rounded ? css`border-radius: 8px;` : null
	}
	${
		({ $accent }) => $accent ? css`background: var(--color-accent);` : null
	}
	${
		({ $danger }) => $danger ? css`background: var(--color-danger);` : null
	}
	
	&:not([disabled]):hover {
		filter: brightness(1.1);
	}
	
	&[disabled] {
		opacity: 0.6;
		cursor: default;
	}
`;