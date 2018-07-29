var MintableToken = artifacts.require("./MintableToken.sol");

module.exports = function(deployer, accounts) {
  deployer.deploy(MintableToken);
};