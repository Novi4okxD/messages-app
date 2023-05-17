import { useState } from 'react';
import styled from 'styled-components';
import { useIMask } from 'react-imask';

import { Container } from '@/components/Container';
import { Input } from '@/components/Input';
import { useAppContext } from '@/stores/App.store';
import { Button } from '@/components/Button';

const MobilePhoneFormContainer = styled(Container)`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export function MobilePhoneForm() {
	const { setMobilePhone } = useAppContext();
	const [ phoneComplete, setPhoneComplete ] = useState<boolean>(false);

	//@ts-ignore
	const onAccept = (value: string, mask: any) => {
		setPhoneComplete(mask.masked.isComplete);
	};

	const {
		ref,
		unmaskedValue,
	} = useIMask({
		mask: '+{7} (000) 000-00-00'
	}, { onAccept });

	const handleChatButtonClick = () => {
		setMobilePhone(unmaskedValue);
	};

	return (
		<MobilePhoneFormContainer $rounded>
			<Input placeholder="Номер телефона" ref={ref} required/>
			<Button $rounded $accent onClick={ handleChatButtonClick }
			        disabled={ !phoneComplete }>
				Создать чат
			</Button>
		</MobilePhoneFormContainer>
	);
}
