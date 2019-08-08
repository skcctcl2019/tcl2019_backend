App = {
    web3Provider: null,
    contracts: {},

    init: async function() {
        return await App.initWeb3();
    },

    initWeb3: async function() {
        // Modern dapp browsers...
        // Using Modern dapp browsers or the more recent versions of MetaMask
        // An ethereum provider is injected into the window object.
        // If so, we use it to create our web3 object, but we also need to explicitly
        // request access to the accounts with etereum.enable()
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
            // Request account access
            await window.ethereum.enable();
            } catch (error) {
            // User denied account access...
            console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        // check for an injected web3 instance
        // older dapp browser(like Mist or an older version of MetaMask)
        // If so, we get its provider and use it to create our web3 object

        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        // create our web3 object based on our local provider
        // This fallback is fine for development enviromnets, but insecure and not suitable for production
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function() {
        // Need to instantaite our smart contract so web3 knows where to find it and how it works.
        // Truffle has a library to help with this called truffle-contract.
        // It keeps information about the contract in sync with migrations
        // so you don`t need to change the contract`s deployed address manually
        
    
        // First retrieve the artifact file for out smart contract.
        // Artifacts are information about our contract such as its deployed address and
        // Application Binary Interface(ABI). The ABI is a JavaScript object defining
        // how to interact with the contract including its variables, functions and their parameters
        $.getJSON('BabyContract.json', function(data) {

        });
    
        return App.bindEvents();
    },
};

$(function() {
    $(window).load(function() {
      App.init();
    });
  });
  