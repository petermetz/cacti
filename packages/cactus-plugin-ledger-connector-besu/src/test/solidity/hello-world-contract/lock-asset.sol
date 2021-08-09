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
  function createAsset(uint num) public returns (uint){
      //default is 0
      assets[msg.sender].unLockAssetNum += num;
      return assets[msg.sender].unLockAssetNum;
  }
  function getLockedAsset() public view returns (uint)
  {
      return assets[msg.sender].lockAssetNum;
  }
  function getUnLockedAsset() public view returns (uint)
  {
      return assets[msg.sender].unLockAssetNum;
  }

  function lockAsset(uint num) public returns(uint, uint){
      if(assets[msg.sender].unLockAssetNum<num){
        return (assets[msg.sender].unLockAssetNum, assets[msg.sender].lockAssetNum);
      }
      assets[msg.sender].unLockAssetNum -= num;
      assets[msg.sender].lockAssetNum += num;
      return (assets[msg.sender].unLockAssetNum, assets[msg.sender].lockAssetNum);
  }
  function unLockAsset(uint num) public returns(uint, uint){
      if(assets[msg.sender].lockAssetNum<num){
        return (assets[msg.sender].unLockAssetNum, assets[msg.sender].lockAssetNum);
      }
      assets[msg.sender].unLockAssetNum += num;
      assets[msg.sender].lockAssetNum -= num;
      return (assets[msg.sender].unLockAssetNum, assets[msg.sender].lockAssetNum);
  }
  function deleteAsset(uint num) public returns(uint){
      //an asset could only be deleted if it is already locked
      if(assets[msg.sender].lockAssetNum<num){
          return assets[msg.sender].lockAssetNum;
      }
      assets[msg.sender].lockAssetNum -= num;
      return assets[msg.sender].lockAssetNum;
  }

}
