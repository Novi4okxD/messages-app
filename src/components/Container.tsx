import styled, { css } from 'styled-components';

interface IContainerProps {
	readonly $rounded?: boolean;
}

export const Container = styled.div<IContainerProps>`
	padding: 8px 16px;
	background: var(--color-panel-background);
	overflow: hidden;
	
	${
		({ $rounded }) => $rounded ? css`border-radius: 8px;` : null 
	}
`;
