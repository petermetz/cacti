import { IEthContractDeployment } from "./i-eth-contract-deployment";
import { ICordaContractDeployment } from "./i-corda-contract-deployment";

export interface IContractDeploymentInfo {
  bambooHarvestRepository: IEthContractDeployment;
  bookshelfRepository: IEthContractDeployment;
  cordaContractDeployment: ICordaContractDeployment;
}
