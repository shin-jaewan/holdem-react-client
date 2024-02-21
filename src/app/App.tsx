import { Path } from '@config/Path'
import 'antd/dist/reset.css'
import React, { createContext, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import locale from "antd/es/locale/ko_KR"
import { ConfigProvider, message } from 'antd'
import 'dayjs/locale/ko';
import { MessageInstance } from 'antd/es/message/interface'
import { Home } from '@pages/Home'
import { Game } from '@pages/game/Game'
import { Host } from '@pages/user/Host'

export const MessageContext = createContext<MessageInstance>(null);

const App = () => {
    useEffect(() => {
        if (window.location.href.match("dev-admin.gongsiltoday.com")) {
            document.title = "공투_어드민_테스트"
        }
    }, []);

    const [messageApi, contextHolder] = message.useMessage();

    return (
        <MessageContext.Provider value={messageApi}>
            {contextHolder}
            <ConfigProvider locale={locale}>
                <BrowserRouter>
                    <Routes>
                        <Route path={Path.home} element={<Home />} />
                        <Route path='/views/home' element={<Home />} />
                        <Route path='*' element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </ConfigProvider>
        </MessageContext.Provider>
    )
}

export default App