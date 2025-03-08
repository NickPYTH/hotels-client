import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import ruRU from 'antd/locale/ru_RU';
import {ConfigProvider} from "antd";
import {setupStore} from "./store/store";
import {Provider} from "react-redux";
import {Router} from "./component/Router";

const store = setupStore();

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ConfigProvider
                locale={ruRU}
                theme={{
                    components: {
                        Table: {
                            cellPaddingInline: 0,
                            cellPaddingBlock: 0
                        }
                    }
                }}
            >
                <Router/>
            </ConfigProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);


