// *****************************************************************************
// IMPORTANT: If you update this code then make sure to recompile
// it and update the .json file as well so that they
// remain in sync for consistent test executions.
// With that said, there shouldn't be any reason to recompile this, like ever...
// *****************************************************************************

pragma solidity >=0.7.0;
struct Assets{
    uint lockAssetNum;
    uint unLockAssetNum;
}
contract LockAsset {

  mapping (address => Assets) assets;
  function createAsset(uint num) public returns (bool){
      if(userExist(msg.sender)){
          return false;
      }
      assets[msg.sender].unLockAssetNum = num;
      return true;
  }
  function getLockedAsset() public view returns (uint)
  {
      if(!userExist(msg.sender)){
          return 0;
      }
      return assets[msg.sender].lockAssetNum;
  }
  function getUnLockedAsset() public view returns (uint)
  {
      if(!userExist(msg.sender)){
          return 0;
      }
      return assets[msg.sender].unLockAssetNum;
  }

  function lockAsset(uint num) public returns(bool){
      if(!userExist(msg.sender)){
          return false;
      }
      if(assets[msg.sender].unLockAssetNum<num){
          return false;
      }
      assets[msg.sender].unLockAssetNum -= num;
      assets[msg.sender].lockAssetNum += num;
      return true;
  }
  function unLockAsset(uint num) public returns(bool){
      if(!userExist(msg.sender)){
          return false;
      }
      if(assets[msg.sender].lockAssetNum<num){
          return false;
      }
      assets[msg.sender].unLockAssetNum += num;
      assets[msg.sender].lockAssetNum -= num;
      return true;
  }
  function deleteAsset(uint num) public returns(bool){
      if(!userExist(msg.sender)){
          return false;
      }
      //an asset could only be deleted if it is already locked
      if(assets[msg.sender].lockAssetNum<num){
          return false;
      }
      assets[msg.sender].lockAssetNum -= num;
      return true;
  }
  function userExist(address user) public view returns(bool){
      bool noAssetForUser = assets[user].lockAssetNum==0 && assets[user].unLockAssetNum==0;
      return noAssetForUser;
  }

}
