import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import timezone from 'dayjs/plugin/timezone'
import { OverlayProvider } from '@toss/use-overlay'

dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.tz.setDefault('Asia/Seoul')

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <OverlayProvider>
            <App />
        </OverlayProvider>
    </React.StrictMode>
)