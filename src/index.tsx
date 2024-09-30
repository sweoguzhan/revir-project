import React from 'react';
import {createRoot} from 'react-dom/client';
// Axios
import axios from 'axios';
import {Chart, registerables} from 'chart.js';
import {QueryClient, QueryClientProvider} from 'react-query';
// Apps
import {MetronicI18nProvider} from './_metronic/i18n/Metronici18n';
import './_metronic/assets/sass/style.scss';
import './_metronic/assets/sass/plugins.scss';
import './_metronic/assets/sass/style.react.scss';
import {AppRoutes} from './app/routing/AppRoutes';
import {AuthProvider, setupAxios} from './app/modules/auth';
import * as Sentry from '@sentry/react';
import {BrowserTracing} from '@sentry/tracing';
import {CookiesProvider} from 'react-cookie';

setupAxios(axios);
Chart.register(...registerables);

Sentry.init({
	dsn: 'https://9e430b00a568403ebb2700b9d3e26880@o4504775465762816.ingest.sentry.io/4504775466680320',
	integrations: [new BrowserTracing()],

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,
});

const queryClient = new QueryClient();
const container = document.getElementById('root');
if (container) {
	createRoot(container).render(
		<QueryClientProvider client={queryClient}>
			<MetronicI18nProvider>
				<CookiesProvider>
					<AuthProvider>
						<AppRoutes />
					</AuthProvider>
				</CookiesProvider>
			</MetronicI18nProvider>
		</QueryClientProvider>,
	);
}
