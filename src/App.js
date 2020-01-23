import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Main } from '@aragon/ui'

import theme from './theme-court'

import MainView from './components/MainView'
import Web3ConnectProvider from './providers/Web3'
import { CourtConfigProvider } from './providers/CourtConfig'

import AppLoader from './components/AppLoader'
import Routes from './Routes'

function App() {
  return (
    <BrowserRouter>
      <Main layout={false} theme={theme} scrollView={false}>
        <Web3ConnectProvider>
          <CourtConfigProvider>
            <MainView>
              <AppLoader>
                <Routes />
              </AppLoader>
            </MainView>
          </CourtConfigProvider>
        </Web3ConnectProvider>
      </Main>
    </BrowserRouter>
  )
}

export default App