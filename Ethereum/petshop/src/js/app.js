App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

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
    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
    
      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
   

    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      // Using call() allows us to read data from the blockchain
      // without having to send a full transaction, meaning we won`t have to spend any ether.
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        // 비교대상 값은 empty Address
        // Since the array contains address types
        // Ethereum initializes the array with 16 empty address.
        // This is why we check for an empty address string ratehr than null or other fasley value.
        // 해당 값이 empty address가 아닌 경우 에 대해 수행

        var diffRes1 = false;

        if (adopters[i] === '0x0000000000000000000000000000000000000000') {
          diffRes1 = true;
        }

        var diffRes2 = false;

        if (adopters[i] === '0x') {
          diffRes2 = true;
        }

        console.log("adopters " + i + " : " + adopters[i]);
        console.log("diff Result1 : " + diffRes1);
        console.log("diff Result2 : " + diffRes2);

        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });

  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
    
        // Execute adopt as a transaction by sending account
        // Transactions require a "from" address and have an associated cost
        // This cost, paid in ether, is called gas
        // The gas cost is the fee for performing computation and/or storing data in a smart contract.
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {

        // The result of sending a transaction is the transaction object
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
    
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
