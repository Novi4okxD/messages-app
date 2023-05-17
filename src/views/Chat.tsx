import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import styled from 'styled-components';

import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Message } from '@/components/Message';
import { useInput } from '@/hooks/useInput';
import { useAppContext } from '@/stores/App.store';
import { useWhatsappAPI } from '@/api/whatsapp';

const MobilePhoneFormContainer = styled(Container)`
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
	padding: 0;
`;

const ChatHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px 16px;
`;

const ChatHeaderControls = styled.div`
	display: flex;
	gap: 8px;
`;

const MessageContainer = styled.div`
	background: var(--color-chat-background);
	overflow: auto;
	flex: 1;
	
	> div {
		height: 100%;
		display: flex;
		flex-direction: column;
		padding: 16px 32px;
		gap: 8px;
		overflow-y: auto;
		
		&::-webkit-scrollbar {
			background: transparent;
			width: 8px;
			height: 8px;
		}
		
		&::-webkit-scrollbar-thumb {
			background: var(--color-default-active-background);
		}
	}

	&::before {
		position: absolute;
		top: 0;
		left: 0;
		content: '';
		display: block;
		width: 100%;
		height: 100%;
		background: url("/bg-image.png");
		opacity: 0.1;
		z-index: 0;
	}
`;

const ContentCenter = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ControlsContainer = styled.div`
	display: flex;
	gap: 8px;
	padding: 8px 16px;

	input {
		flex: 1;
	}
`;

export function Chat() {
	const { data, setMobilePhone, setIdInstance, setApiTokenInstance } = useAppContext();
	const whatsappAPI = useWhatsappAPI();

	const [ userHaveWhatsApp, setUserHaveWhatsApp ] = useState<boolean | null>(null);
	const [ messages, setMessages ] = useState<any[]>([]);
	const messageInput = useInput('');
	const messageContainerRef = useRef<HTMLDivElement | null>(null);
	const awaitMessagesBreak = useRef<boolean>(false);

	const appendMessageIfNotExists = (type: 'incoming' | 'outgoing', body: any) => {
		const { messageData } = body;

		const pushMessage = (text: string) => {
			const hasMessage = messages.find(message => message.idMessage === body.idMessage);
			if (!hasMessage) {
				setMessages(messages => [ ...messages.slice(-49), {
					idMessage: body.idMessage,
					type: type,
					statusMessage: type === 'outgoing' ? 'pending' : 'read',
					textMessage: text,
					timestamp: body.timestamp
				} ]);
			}
		};

		if (messageData.typeMessage === 'textMessage') {
			const messageText = messageData.textMessageData.textMessage;
			pushMessage(messageText);
		}
		if (messageData.typeMessage === 'extendedTextMessage') {
			const messageText = messageData.extendedTextMessageData.text;
			pushMessage(messageText);
		}
	};

	const updateMessageStatus = (messageId: string, status: string) => {
		setMessages(messages => messages.map(message => {
			if (message.idMessage === messageId) {
				message.statusMessage = status;
			}
			return message;
		}));
	};

	const awaitMessages = async () => {
		if (!awaitMessagesBreak.current) {
			try {
				let response = await whatsappAPI.receiveNotification();
				if (response) {
					let webhookBody = response.body;
					if (webhookBody.typeWebhook === 'incomingMessageReceived') {
						if (webhookBody.senderData.chatId === whatsappAPI.getCorrespondentID()) {
							appendMessageIfNotExists('incoming', webhookBody);
							await whatsappAPI.readMessage(webhookBody.idMessage);
						}
					} else if (webhookBody.typeWebhook === 'outgoingMessageStatus') {
						updateMessageStatus(webhookBody.idMessage, webhookBody.status);
					} else if (webhookBody.typeWebhook === 'outgoingMessageReceived') {
						appendMessageIfNotExists('outgoing', webhookBody);
					} else if (webhookBody.typeWebhook === 'outgoingAPIMessageReceived') {
						appendMessageIfNotExists('outgoing', webhookBody);
					}
					await whatsappAPI.deleteNotification(response.receiptId);
				}
				awaitMessages();
			} catch (e) {
				console.error(e);
			}
		}
	};

	useEffect(() => {
		(async () => {
			const response = await whatsappAPI.existsWhatsapp();
			if (!response) {
				return;
			}
			setUserHaveWhatsApp(response.existsWhatsapp);

			if (response.existsWhatsapp) {
				const messages = await whatsappAPI.getChatHistory();
				setMessages(messages.reverse().filter((message: any) =>
					message.chatId === whatsappAPI.getCorrespondentID() &&
					( message.typeMessage === 'textMessage' || message.typeMessage === 'extendedTextMessage')
				).slice(30));
				awaitMessages();
			}
		})();

		return () => {
			awaitMessagesBreak.current = true;
		};
	}, []);

	useEffect(() => {
		if (messageContainerRef.current) {
			messageContainerRef.current!.scrollTop = messageContainerRef.current!.scrollHeight;
		}
	}, [ messages ]);

	const handleSendMessage = async () => {
		const messageText = messageInput.props.value;
		const response = await whatsappAPI.sendTextMessage(messageText);
		if (response) {
			const { idMessage } = response;
			appendMessageIfNotExists('outgoing', {
				idMessage,
				timestamp: Date.now() / 1000,
				messageData: {
					typeMessage: 'textMessage',
					textMessageData: {
						textMessage: messageText
					}
				}
			});
		}
		messageInput.clear();
	};

	const handleMessageInputKey = async (e: KeyboardEvent<HTMLInputElement>) => {
		const messageInputValue = messageInput.props.value;
		if (e.key === 'Enter' && messageInputValue) {
			await whatsappAPI.sendTextMessage(messageInputValue);
			messageInput.clear();
		}
	};

	const handleChangeNumber = () => {
		setMobilePhone('');
	};

	const handleLogOut = () => {
		setMobilePhone('');
		setIdInstance('');
		setApiTokenInstance('');
	};

	return (
		<MobilePhoneFormContainer $rounded>
			<ChatHeader>
				<span>Чат: { data.mobilePhone.indexOf('+') >= 0 ? data.mobilePhone : '+' + data.mobilePhone }</span>
				<ChatHeaderControls>
					<Button $rounded onClick={ handleChangeNumber }>
						Сменить номер телефона
					</Button>
					<Button $rounded $danger onClick={ handleLogOut }>
						Выйти
					</Button>
				</ChatHeaderControls>
			</ChatHeader>
			<MessageContainer>
				{
					userHaveWhatsApp === null ? (
						<ContentCenter>
							Загрузка...
						</ContentCenter>
					) : (
						userHaveWhatsApp ? (
							<div ref={ messageContainerRef }>
								{ messages.length ? messages.map(message => (
									<Message key={ message.idMessage } message={ message }/>
								)) : null }
							</div>
						) : (
							<ContentCenter>
								У пользователя нет аккаунта WhatsApp
							</ContentCenter>
						)
					)
				}
			</MessageContainer>
			{
				userHaveWhatsApp && (
					<ControlsContainer>
						<Input placeholder="Введите сообщение" { ...messageInput.props }
						       onKeyUp={ handleMessageInputKey }/>
						<Button $rounded $accent disabled={ !messageInput.props.value }
						        onClick={ handleSendMessage }>
							Отправить
						</Button>
					</ControlsContainer>
				)
			}
		</MobilePhoneFormContainer>
	);
}
