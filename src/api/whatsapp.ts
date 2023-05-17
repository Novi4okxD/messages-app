import Noty from 'noty';

import { useAppContext } from '@/stores/App.store';

export const useWhatsappAPI = () => {
	const { data: appData } = useAppContext();

	const getCorrespondentID = () => {
		return `${parseInt(appData.mobilePhone)}@c.us`;
	};

	const request = async (methodName: string, method: string, data?: any, urlAppend?: string) => {
		const params: RequestInit = {
			method: method ?? 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		};
		if (data) {
			params.body = JSON.stringify(data);
		}
		let requestResult;
		try {
			const response = await fetch(`https://api.green-api.com/waInstance${ appData.idInstance }/${ methodName }/${ appData.apiTokenInstance }${ urlAppend ? `/${ urlAppend }` : '' }`, params);
			if (response.status === 401) {
				requestResult = {
					invokeStatus: {
						descr: 'Некорректные данные для авторизации',
						status: 'NOT_AUTHORIZED',
						method: methodName
					}
				};
			} else {
				requestResult = await response.json()
			}
		} catch(error) {
			requestResult = {
				invokeStatus: {
					descr: 'Произошла неизвестная ошибка',
					status: 'UNKNOWN_ERROR',
					method: methodName
				}
			};
		}
		if (requestResult && requestResult.invokeStatus) {
			new Noty({
				type: 'error',
				text: `${ requestResult.invokeStatus.method }: ${ requestResult.invokeStatus.descr }`,
				layout: 'bottomRight',
				timeout: 10000
			}).show();
			return null;
		}
		return requestResult;
	};

	const existsWhatsapp = async () => {
		return request('CheckWhatsapp','POST', {
			phoneNumber: parseInt(appData.mobilePhone)
		});
	};

	const getChatHistory = async () => {
		return request('GetChatHistory', 'POST', {
			chatId: getCorrespondentID()
		});
	};

	const sendTextMessage = async (text: string) => {
		return request('SendMessage', 'POST', {
			chatId: getCorrespondentID(),
			message: text
		});
	};

	const receiveNotification = async () => {
		return request('ReceiveNotification', 'GET');
	};

	const deleteNotification = async (receiptId: number) => {
		return request('DeleteNotification', 'DELETE', null, receiptId.toString());
	};

	const readMessage = async (idMessage: string) => {
		return request('ReadChat', 'POST', {
			chatId: getCorrespondentID(),
			idMessage
		});
	};

	return {
		getCorrespondentID,
		existsWhatsapp,
		getChatHistory,
		sendTextMessage,
		receiveNotification,
		deleteNotification,
		readMessage
	};
};

