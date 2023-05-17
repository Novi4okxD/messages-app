import styled from 'styled-components';

import { Container } from '@/components/Container';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAppContext } from '@/stores/App.store';
import { useInput } from '@/hooks/useInput';

const LoginFormContainer = styled(Container)`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export function LoginForm() {
	const { setIdInstance, setApiTokenInstance } = useAppContext();

	const idInstanceInput = useInput('');
	const apiTokenInstanceInput = useInput('');

	const handleLoginButtonClick = () => {
		setIdInstance(idInstanceInput.props.value);
		setApiTokenInstance(apiTokenInstanceInput.props.value);
	};

	return (
		<LoginFormContainer $rounded>
			<Input placeholder="IdInstance" { ...idInstanceInput.props } required/>
			<Input placeholder="ApiTokenInstance" { ...apiTokenInstanceInput.props } required/>
			<Button $rounded $accent onClick={ handleLoginButtonClick }
			        disabled={ !idInstanceInput.props.value || !apiTokenInstanceInput.props.value }>
				Войти
			</Button>
		</LoginFormContainer>
	);
}
