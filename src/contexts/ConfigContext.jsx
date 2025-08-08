import PropTypes from 'prop-types';
import { createContext, useReducer, useEffect } from 'react';
import * as actionType from 'store/actions';
import { CONFIG } from 'config/constant';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_APP_URL}/config`;

const initialState = {
	...CONFIG,
	isOpen: [],
	isTrigger: []
};

const ConfigContext = createContext({});
const { Provider } = ConfigContext;

function ConfigProvider({ children }) {
	let trigger = [];
	let open = [];

	const [state, dispatch] = useReducer((stateData, action) => {
		switch (action.type) {
			case actionType.INIT_CONFIG:
				return {
					...stateData,
					...action.payload
				};
			case actionType.COLLAPSE_MENU:
				return {
					...stateData,
					collapseMenu: !stateData.collapseMenu
				};
			case actionType.COLLAPSE_HEADERMENU:
				return {
					...stateData,
					collapseHeaderMenu: !stateData.collapseHeaderMenu
				};
			case actionType.COLLAPSE_TOGGLE:
				if (action.menu.type === 'sub') {
					open = stateData.isOpen;
					trigger = stateData.isTrigger;

					const triggerIndex = trigger.indexOf(action.menu.id);
					if (triggerIndex > -1) {
						open = open.filter((item) => item !== action.menu.id);
						trigger = trigger.filter((item) => item !== action.menu.id);
					} else {
						open = [...open, action.menu.id];
						trigger = [...trigger, action.menu.id];
					}
				} else {
					const triggerIndex = stateData.isTrigger.indexOf(action.menu.id);
					trigger = triggerIndex === -1 ? [action.menu.id] : [];
					open = triggerIndex === -1 ? [action.menu.id] : [];
				}
				return {
					...stateData,
					isOpen: open,
					isTrigger: trigger
				};
			default:
				return stateData;
		}
	}, initialState);

	useEffect(() => {
		const cached = localStorage.getItem('APP_CONFIG');
		if (cached) {
			try {
				const parsed = JSON.parse(cached);
				dispatch({ type: actionType.INIT_CONFIG, payload: parsed });
				return;
			} catch (e) {
				console.warn('Invalid config cache, refetching...');
			}
		}

		axios
			.get(API_URL)
			.then((res) => {
				const configData = res?.data?.result || {};
				localStorage.setItem('APP_CONFIG', JSON.stringify(configData));
				dispatch({ type: actionType.INIT_CONFIG, payload: configData });
			})
			.catch((err) => {
				console.error('Failed to fetch config:', err);
			});
	}, []);

	return <Provider value={{ state, dispatch }}>{children}</Provider>;
}

ConfigProvider.propTypes = { children: PropTypes.any };
export { ConfigContext, ConfigProvider };
