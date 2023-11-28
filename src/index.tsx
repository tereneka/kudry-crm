import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App/App';
import { Provider } from 'react-redux';
import { store } from './store';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { HashRouter } from 'react-router-dom';

dayjs.locale('ru-ru');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: 'rgb(137, 175, 176)',
          colorError: '#c5776b',
          colorWarning: '#c5776b',
          fontFamily:
            '"Source Code Pro", monospace',
          colorTextBase: 'rgb(60, 60, 60)',
          colorBgBase: 'rgb(250, 250, 250)',
          fontSize: 16,
        },
        components: {
          Result: {
            iconFontSize: 40,
            titleFontSize: 16,
          },
        },
      }}>
      <HashRouter>
        <App />
      </HashRouter>
    </ConfigProvider>
  </Provider>
);
