import { DaoConfig, ContainerConfig } from './createDao'
import { ContractInterface, Contract } from '@ethersproject/contracts'
import { Web3Provider, TransactionResponse, TransactionReceipt } from '@ethersproject/providers'
import { BigNumberish } from '@ethersproject/bignumber'
import { BytesLike } from '@ethersproject/bytes'
import { toUtf8Bytes } from '@ethersproject/strings'


const Payload = `
  tuple(
    uint256 nonce,
    uint256 executionTime,
    address submitter,
    address executor,
    tuple(
      address to,
      uint256 value,
      bytes data
    )[] actions,
    bytes32 allowFailuresMap,
    bytes proof
  )
`

export const Container = `
  tuple(
    ${Payload} payload,
    ${ContainerConfig} config
  )
`
const Collateral = `
  tuple(
    address token,
    uint256 amount
  ) collateral
`

const queueAbis = [
  `function nonce() view returns (uint256)`,
  `function schedule(${Container} _container)`,
  `function execute(${Container} _container)`,
  `function challenge(${Container} _container, bytes _reason)`,
  `function resolve(${Container} _container, uint256 _disputeId)`,
  `function veto(${Container} _container, bytes _reason)`,
  `event Challenged(bytes32 indexed hash, address indexed actor, bytes reason, uint256 resolverId, ${Collateral})`
]

declare let window: any

export type ProposalOptions = {
  provider?: any
  abi?: ContractInterface
}

export type ProposalParams = {
  payload: PayloadType
  config: DaoConfig
}

export type PayloadType = {
  nonce?: BigNumberish
  executionTime: BigNumberish
  submitter: string
  executor: string
  actions: ActionType[]
  allowFailuresMap: BytesLike
  proof: BytesLike
}

export type ActionType = {
  to: string
  value: BigNumberish
  data: BytesLike
}

export class Proposal {
  private readonly contract: Contract

  constructor(queueAddress: string, options: ProposalOptions) {
    const abi = options?.abi || queueAbis

    const provider = options.provider || window.ethereum
    const signer = new Web3Provider(provider).getSigner()
    this.contract = new Contract(queueAddress, abi, signer)
  }

  
  

  /**
   * Create and schedule a proposal
   *
   * @param {ProposalParams} proposal for creating and scheduling a DAO proposal
   *
   * @returns {Promise<TransactionResponse>} transaction response object
   */
  async schedule(proposal: ProposalParams): Promise<TransactionResponse> {
    const nonce = await this.contract.nonce()

    const proposalWithNonce = Object.assign({}, proposal)
    proposalWithNonce.payload.nonce = nonce.add(1)
    const result = this.contract.schedule(proposalWithNonce)
    return result
  }

  oeyeah():any {
    console.log("good");
  }

  /**
   * Execute a proposal
   *
   * @param {ProposalParams} proposal to execute
   *
   * @returns {Promise<TransactionResponse>} transaction response object
   */
  async execute(proposal: ProposalParams): Promise<TransactionResponse> {
    const result = this.contract.execute(proposal)
    return result
  }

  /**
   * Veto a proposal
   *
   * @param {ProposalParams} proposal to veto
   *
   * @param {string} reason
   *
   * @returns {Promise<TransactionResponse>} transaction response object
   */
  async veto(proposal: ProposalParams, reason: string): Promise<TransactionResponse> {
    const reasonBytes = toUtf8Bytes(reason)
    const result = this.contract.veto(proposal, reasonBytes)
    return result
  }

  /**
   * Resolve a proposal
   *
   * @param {ProposalParams} proposal to resolve
   *
   * @param {number} disputeId
   *
   * @returns {Promise<TransactionResponse>} transaction response object
   */
  async resolve(proposal: ProposalParams, disputeId: number): Promise<TransactionResponse> {
    const result = this.contract.resolve(proposal, disputeId)
    return result
  }

  /**
   * Challenge a proposal
   *
   * @param {ProposalParams} proposal to challenge
   *
   * @param {string} reason
   *
   * @returns {Promise<TransactionResponse>} transaction response object
   */
  async challenge(proposal: ProposalParams, reason: string): Promise<TransactionResponse> {
    const reasonBytes = toUtf8Bytes(reason)
    const result = this.contract.challenge(proposal, reasonBytes)
    return result
  }

  /**
   * Get the disputeId from a challenge proposal receipt
   *
   * @param {TransactionReceipt} receipt from the challenged proposal
   *
   * @returns {number|null>} transaction response object
   */
  getDisputeId(receipt: TransactionReceipt): number|null {
    const args = receipt.logs
    .filter(({ address }: { address : string }) => address === this.contract.address)
    .map((log: any) => this.contract.interface.parseLog(log))
    .find(({ name }: { name: string }) => name === 'Challenged')

    const rawDisputeId = args?.args[3]
    const disputeId = rawDisputeId? rawDisputeId.toNumber() : null

    return disputeId
  }
}
