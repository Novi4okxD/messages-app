import React from 'react';

interface IAppContextState {
	idInstance: string;
	apiTokenInstance: string;
	mobilePhone: string;
}

export interface IAppContext {
	data: IAppContextState;
	setIdInstance: (idInstance: string) => void;
	setApiTokenInstance: (apiTokenInstance: string) => void;
	setMobilePhone: (mobilePhone: string) => void;
}

const getInitialState = () => ({
	idInstance: '',
	apiTokenInstance: '',
	mobilePhone: '',
});

const getInitialContext = () => ({
	data: getInitialState(),
	setIdInstance: () => {},
	setApiTokenInstance: () => {},
	setMobilePhone: () => {},
});

const AppContext = React.createContext<IAppContext>(getInitialContext());

export function useAppContext() {
	return React.useContext(AppContext);
}

export function AppContextConsumer({ children }: { children: (value: IAppContext) => React.ReactNode }) {
	return (
		<AppContext.Consumer>
			{ children }
		</AppContext.Consumer>
	)
}

export function AppContextProvider({ children }: React.PropsWithChildren) {
	const localStorageKey = 'message-app-saved-state';

	const load = () => {
		const localStorageData = localStorage.getItem(localStorageKey);
		if (localStorageData) {
			return JSON.parse(localStorageData);
		} else {
			return getInitialState();
		}
	};

	const [ appState, setAppState ] = React.useState<IAppContextState>(load());

	const save = () => {
		localStorage.setItem(localStorageKey, JSON.stringify(appState))
	};

	const setIdInstance = (idInstance: string) => {
		setAppState(state => ({
			...state,
			idInstance
		}));
	};

	const setApiTokenInstance = (apiTokenInstance: string) => {
		setAppState(state => ({
			...state,
			apiTokenInstance
		}));
	};

	const setMobilePhone = (mobilePhone: string) => {
		setAppState(state => ({
			...state,
			mobilePhone
		}));
	};

	React.useEffect(() => {
		save();
	}, [ appState ]);

	return (
		<AppContext.Provider value={{
			data: appState,
			setIdInstance,
			setApiTokenInstance,
			setMobilePhone
		}}>
			{ children }
		</AppContext.Provider>
	)
}
