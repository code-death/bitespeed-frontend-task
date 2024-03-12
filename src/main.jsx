import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'reactflow/dist/style.css';
import {Provider} from "react-redux";
import store from './redux/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Fragment>
      <Provider store={store}>
          <App />
      </Provider>
  </React.Fragment>,
)
