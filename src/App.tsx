import styled from 'styled-components';
import 'noty/lib/noty.css';
import 'noty/lib/themes/mint.css';

import { AppContextConsumer, AppContextProvider, IAppContext } from '@/stores/App.store';
import { LoginForm } from '@/views/LoginForm';
import { MobilePhoneForm } from '@/views/MobilePhoneForm';
import { Chat } from '@/views/Chat';

const AppContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	
	&::before {
		position: absolute;
		content: '';
		display: block;
		width: 100%;
		height: 100%;
		background: url("/bg-image.png");
		opacity: 0.1;
		z-index: -1;
	}
`;

function App() {
	return (
		<AppContextProvider>
			<AppContainer>
				<AppContextConsumer>
					{ (context: IAppContext) => {
						if (!context.data.idInstance && !context.data.apiTokenInstance) {
							return (
								<LoginForm/>
							);
						} else if (!context.data.mobilePhone) {
							return (
								<MobilePhoneForm/>
							);
						}
						return (
							<Chat/>
						);
					} }
				</AppContextConsumer>
			</AppContainer>
		</AppContextProvider>
	);
}

export default App;
