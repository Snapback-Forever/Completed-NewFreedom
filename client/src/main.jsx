import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"

import store from "./redux/index.js"
import App from './App.jsx'

import './styles.css'
import './index.css' //TAILWIND LINK
import "bootstrap/dist/css/bootstrap.min.css" //BOOTSTRAP LINK


createRoot(document.getElementById('root')).render(
  <>
  
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>

</>
)
