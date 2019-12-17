import React, { Component } from "react";
import Web3 from "web3"; // uses latest 1.x.x version
import Web3Provider from 'web3-react';
import { Web3Consumer } from 'web3-react'
import connectors from './connectors';

import {
  HashRouter as Router,
  Switch,
  Route,
  // useParams
} from "react-router-dom";

import theme from "../theme";

import { ThemeProvider, Box } from 'rimble-ui';
import RimbleWeb3 from "../utilities/RimbleWeb3";
import Header from "../utilities/components/Header";
import Landing from "../Landing/Landing";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import Tos from "../Tos/Tos";
import PageNotFound from "../PageNotFound/PageNotFound";
import Web3Debugger from "../Web3Debugger/Web3Debugger";
import availableTokens from '../availableTokens';

class App extends Component {
  state = {
    selectedToken: null,
    tokenConfig: null,
    genericError: null,
    width: window.innerWidth,
    route: "default", // or 'onboarding'
    unsubscribeFromHistory:null,
    selectedTab: '1',
    buyModalOpened: false,
    connectorName:null,
    walletProvider:null
  };

  async selectTab(e, tabIndex) {
    return this.setState(state => ({...state, selectedTab: tabIndex}));
  }

  componentWillMount() {

    let selectedToken = this.state.selectedToken;
    if (!selectedToken){
      selectedToken = localStorage ? localStorage.getItem('selectedToken') : null;
      if (!selectedToken){
        selectedToken = Object.keys(availableTokens)[0];
      }
    }
    this.setSelectedToken(selectedToken);

    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    if (window.innerWidth !== this.state.width){
      return this.setState({ width: window.innerWidth });
    }
  };

  // Optional parameters to pass into RimbleWeb3
  config = {
    requiredConfirmations: 1,
    accountBalanceMinimum: 0, // in ETH for gas fees
    requiredNetwork: 1 // Mainnet
    // requiredNetwork: 3 // Ropsten
  };

  showRoute(route) {
    return this.setState({ route });
  }

  closeBuyModal(e) {
    if (e){
      e.preventDefault();
    }
    return this.setState({
      buyModalOpened:false
    });
  }

  openBuyModal(e) {
    e.preventDefault();
    return this.setState({
      buyModalOpened:true
    });
  }

  setConnector(connectorName,walletProvider){
    console.log('setConnector',connectorName,walletProvider);
    return this.setState({
      connectorName,
      walletProvider
    });
  }

  setSelectedToken(selectedToken){
    if (Object.keys(availableTokens).indexOf(selectedToken) !== -1){
      const tokenConfig = availableTokens[selectedToken];
      if (selectedToken !== this.state.selectedToken || tokenConfig !== this.state.tokenConfig){
        if (localStorage){
          localStorage.setItem('selectedToken',selectedToken);
        }
        return this.setState({
          tokenConfig,
          selectedToken
        });
      }
    }
  }

  render() {
    const isMobile = this.state.width <= 768;

    return (
      <Router>
        <ScrollToTop />
        <ThemeProvider theme={theme}>
          <Web3Provider
            connectors={connectors}
            libraryName={'web3.js'}
            web3Api={Web3}
          >
            <Web3Consumer>
              {context => {
                return (
                  <RimbleWeb3
                    config={this.config}
                    context={context}
                    tokenConfig={this.state.tokenConfig}
                    selectedToken={this.state.selectedToken}
                    setConnector={this.setConnector.bind(this)}
                    isMobile={isMobile}
                  >
                    <RimbleWeb3.Consumer>
                      {({
                        needsPreflight,
                        web3,
                        initWeb3,
                        account,
                        contracts,
                        getAccountBalance,
                        getTokenDecimals,
                        accountBalance,
                        accountBalanceToken,
                        accountBalanceLow,
                        initAccount,
                        initContract,
                        rejectAccountConnect,
                        userRejectedConnect,
                        accountValidated,
                        accountValidationPending,
                        rejectValidation,
                        userRejectedValidation,
                        validateAccount,
                        connectAndValidateAccount,
                        modals,
                        network,
                        transaction
                      }) => {
                        return (
                        <Box>
                          <Header
                            account={account}
                            initWeb3={initWeb3}
                            initContract={initContract}
                            contracts={contracts}
                            isMobile={isMobile}
                            walletProvider={this.state.walletProvider}
                            connectorName={this.state.connectorName}
                            buyModalOpened={this.state.buyModalOpened}
                            getAccountBalance={getAccountBalance}
                            getTokenDecimals={getTokenDecimals}
                            accountBalance={accountBalance}
                            accountBalanceToken={accountBalanceToken}
                            accountBalanceLow={accountBalanceLow}
                            initAccount={initAccount}
                            rejectAccountConnect={rejectAccountConnect}
                            userRejectedConnect={userRejectedConnect}
                            accountValidated={accountValidated}
                            accountValidationPending={accountValidationPending}
                            rejectValidation={rejectValidation}
                            userRejectedValidation={userRejectedValidation}
                            validateAccount={validateAccount}
                            connectAndValidateAccount={connectAndValidateAccount}
                            closeBuyModal={this.closeBuyModal.bind(this)}
                            handleMenuClick={this.selectTab.bind(this)}
                            availableTokens={availableTokens}
                            tokenConfig={this.state.tokenConfig}
                            selectedToken={this.state.selectedToken}
                            setSelectedToken={ e => { this.setSelectedToken(e) } }
                            modals={modals}
                            network={network}
                          />

                          {this.state.route === "onboarding" ? (
                            <Web3Debugger
                              web3={web3}
                              account={account}
                              accountBalance={accountBalance}
                              accountBalanceToken={accountBalanceToken}
                              accountBalanceLow={accountBalanceLow}
                              initAccount={initAccount}
                              rejectAccountConnect={rejectAccountConnect}
                              userRejectedConnect={userRejectedConnect}
                              accountValidated={accountValidated}
                              accountValidationPending={accountValidationPending}
                              rejectValidation={rejectValidation}
                              userRejectedValidation={userRejectedValidation}
                              validateAccount={validateAccount}
                              connectAndValidateAccount={connectAndValidateAccount}
                              modals={modals}
                              network={network}
                              transaction={transaction}
                            />
                          ) : null}

                          {this.state.route === "default" ? (
                            <Switch>
                              <Route exact path="/">
                                <Landing
                                  web3={web3}
                                  contracts={contracts}
                                  isMobile={isMobile}
                                  account={account}
                                  getAccountBalance={getAccountBalance}
                                  accountBalance={accountBalance}
                                  accountBalanceToken={accountBalanceToken}
                                  accountBalanceLow={accountBalanceLow}
                                  openBuyModal={this.openBuyModal.bind(this)}
                                  updateSelectedTab={this.selectTab.bind(this)}
                                  selectedTab={this.state.selectedTab}
                                  selectedToken={this.state.selectedToken}
                                  availableTokens={availableTokens}
                                  tokenConfig={this.state.tokenConfig}
                                  setSelectedToken={ e => { this.setSelectedToken(e) } }
                                  network={network} />
                              </Route>
                              <Route path="/terms-of-service">
                                <Tos />
                              </Route>
                              <Route>
                                <PageNotFound />
                              </Route>
                            </Switch>
                          ) : null}
                        </Box>
                      )}}
                    </RimbleWeb3.Consumer>
                  </RimbleWeb3>
                );
              }}
            </Web3Consumer>
          </Web3Provider>
        </ThemeProvider>
      </Router>
    );
  }
}

export default App;
