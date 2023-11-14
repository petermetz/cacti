curl --location 'http://127.0.0.1:8080/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-corda/list-flows' \
--header 'Content-Type: application/json' \
--data '{}'

# Example Response
#
# {
#     "flowNames": [
#         "com.r3.corda.evminterop.workflows.IssueGenericAssetFlow",
#         "com.r3.corda.evminterop.workflows.UnsecureRemoteEvmIdentityFlow",
#         "com.r3.corda.evminterop.workflows.eth2eth.Erc20TokensAllowanceFlow",
#         "com.r3.corda.evminterop.workflows.eth2eth.Erc20TokensApproveFlow",
#         "com.r3.corda.evminterop.workflows.eth2eth.Erc20TokensBalanceFlow",
#         "com.r3.corda.evminterop.workflows.eth2eth.Erc20TokensTotalSupplyFlow",
#         "com.r3.corda.evminterop.workflows.eth2eth.Erc20TokensTransferFromFlow",
#         "com.r3.corda.evminterop.workflows.eth2eth.Erc20TransferFlow",
#         "com.r3.corda.evminterop.workflows.eth2eth.GetBlockFlow",
#         "com.r3.corda.evminterop.workflows.eth2eth.GetBlockReceiptsFlow",
#         "com.r3.corda.evminterop.workflows.eth2eth.GetTransactionFlow",
#         "com.r3.corda.evminterop.workflows.eth2eth.GetTransactionReceiptFlow",
#         "com.r3.corda.evminterop.workflows.swap.BuildAndProposeDraftTransactionFlow",
#         "com.r3.corda.evminterop.workflows.swap.ClaimCommitment",
#         "com.r3.corda.evminterop.workflows.swap.CommitWithTokenFlow",
#         "com.r3.corda.evminterop.workflows.swap.CommitmentHash",
#         "com.r3.corda.evminterop.workflows.swap.RequestBlockHeaderProofs$Initiator",
#         "com.r3.corda.evminterop.workflows.swap.RevertCommitment",
#         "com.r3.corda.evminterop.workflows.swap.SignDraftTransactionFlow",
#         "com.r3.corda.evminterop.workflows.swap.UnlockTransactionAndObtainAssetFlow",
#         "com.r3.corda.evminterop.workflows.token.GetTokenMetadataByAddressFlow",
#         "net.corda.core.flows.ContractUpgradeFlow$Authorise",
#         "net.corda.core.flows.ContractUpgradeFlow$Deauthorise",
#         "net.corda.core.flows.ContractUpgradeFlow$Initiate",
#         "net.corda.finance.flows.CashExitFlow",
#         "net.corda.finance.flows.CashIssueAndPaymentFlow",
#         "net.corda.finance.flows.CashIssueFlow",
#         "net.corda.finance.flows.CashPaymentFlow",
#         "net.corda.finance.internal.CashConfigDataFlow",
#         "net.corda.samples.obligation.flows.IOUIssueFlow",
#         "net.corda.samples.obligation.flows.IOUSettleFlow",
#         "net.corda.samples.obligation.flows.IOUTransferFlow",
#         "net.corda.samples.obligation.flows.SelfIssueCashFlow"
#     ]
# }