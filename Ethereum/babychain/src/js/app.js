App = {
    web3Provider: null,
    contracts: {},

    init: async function() {
        return await App.initWeb3();
    },

    initWeb3: async function() {
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                await window.ethereum.enable();
            } catch (error) {
                console.error("User denied account access")
            }
        } else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function() {
        $.getJSON('BabyContract.json', function(data) {
            var BabyArtifact = data;
            App.contracts.BabyContract = TruffleContract(BabyArtifact);
            App.contracts.BabyContract.setProvider(App.web3Provider);
        });
    
        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', '.btn-add', App.addBaby);
        $(document).on('click', '.btn-cnt',  function(event) {
            App.getBabiesCount();
        });
        $(document).on('click', '.btn-allBabies',  function(event) {
            App.getAllBabies();
        });
        $(document).on('click', '.btn-babyById', function(event) {
            var id = document.getElementById("id").value;
            App.getBabyById(id);
        });
        $(document).on('click', '.btn-babyByPath', function(event) {
            var imagePath = document.getElementById("imagePath2").value;
            App.getBabyByImagePath(imagePath);
        });
    },

    addBaby : function(event) {
        event.preventDefault();

        var babyInstance;

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
              console.log(error);
            }

            var account = accounts[0];

            App.contracts.BabyContract.deployed().then(function(instance) {
                babyInstance = instance;

                var imagePath = document.getElementById("imagePath").value;
                var etcSpfeatr = document.getElementById("etcSpfeatr").value;
                var phoneNumber = document.getElementById("phoneNumber").value;
                var age = document.getElementById("age").value;
                
                return babyInstance.addBaby(imagePath, etcSpfeatr, phoneNumber, age, {from: account});
            }).then(function(result) {
                console.log(result);
            }).catch(function(err) {
                console.log(err.message);
            });
        });
    },

    getBabiesCount : function() {        
        var babyInstance;

        App.contracts.BabyContract.deployed().then(function(instance) {
            babyInstance = instance;

            return babyInstance.getBabiesCount.call();
        }).then(function(length) {
            console.log("getBabiesCount : " + length);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    getAllBabies : function() {
        var babyInstance;

        App.contracts.BabyContract.deployed().then(function(instance) {
            babyInstance = instance;

            return babyInstance.getBabiesCount.call().then(function(length) {
               for(var i=0; i<length; i++)  {
                   App.getBaby(i);
               }
            });
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    getBabyById : function(id) {
        var babyInstance;

        App.contracts.BabyContract.deployed().then(function(instance) {
            babyInstance = instance;

            return babyInstance.getBabyById(id);
        }).then(function(data) {
            App.displayBaby(data[0], data[1], data[2], data[3]);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    getBabyByImagePath : function(path) {
        var babyInstance;

        App.contracts.BabyContract.deployed().then(function(instance) {
            babyInstance = instance;

            return babyInstance.getBabyByImagePath(path);
        }).then(function(data) {
            App.displayBaby(data[0], data[1], data[2], data[3]);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    displayBaby : function(imagePath, etcSpfeatr, phoneNumber, age) {
        console.log("imagePath : " + imagePath);
        console.log("etcSpfeatr : " + etcSpfeatr);
        console.log("phoneNumber : " + phoneNumber);
        console.log("age : " + age);
    }
};

$(function() {
    $(window).load(function() {
        App.init();
    });
});
  