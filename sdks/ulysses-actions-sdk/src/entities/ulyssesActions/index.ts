import {
  TBurnHermesParams,
  TClaimAllRewardsParams,
  TClaimRewardParams,
  TCreateIncentiveParams,
  TDecrementAllGaugesBoostParams,
  TDecrementGaugeAllBoostParams,
  TDecrementGaugeBoostParams,
  TDecrementGaugeParams,
  TDecrementGaugesBoostIndexedParams,
  TDecrementGaugesParams,
  TDelegateGaugeParams,
  TDelegateVotesParams,
  TIncrementGaugeParams,
  TIncrementGaugesParams,
  TStakeTokenParams,
  TUndelegateGaugeParams,
  TUndelegateVotesParams,
  TUnstakeTokenParams,
} from 'hermes-v2-sdk'
import { ZERO_ADDRESS } from 'maia-core-sdk'
import {
  TClaimMultipleAmountsParams,
  TClaimParams,
  TDepositParams,
  TForfeitMultipleAmountsParams,
  TForfeitParams,
  TMintParams,
  TRedeemParams,
  TWithdrawParams,
} from 'maia-v2-sdk'
import {
  TCreateTalosManagerParams,
  TCreateTalosOptimizerParams,
  TCreateTalosStrategyStakedParams,
  TCreateTalosStrategyVanillaParams,
  TStrategyDepositParams,
  TStrategyRedeemParams,
} from 'talos-sdk'

import { IAction, IActionResult } from '../../utils/action'
import { ActionBuilder } from '../../utils/actionBuilder'
import { ContextHandler, IContextParameters } from '../../utils/actionContext'
import { BurnHermesAction } from './bHermes/actions/burn'
import { DecrementAllGaugesAllBoostAction, DecrementAllGaugesBoostAction } from './bHermesBoost'
import {
  DecrementGaugeAllBoostAction,
  DecrementGaugeBoostAction,
  DecrementGaugesBoostIndexedAction,
} from './bHermesBoost/actions'
import {
  DecrementGaugeAction,
  DecrementGaugesAction,
  DelegateGaugeAction,
  IncrementGaugeAction,
  IncrementGaugesAction,
  UndelegateGaugeAction,
} from './bHermesGauges/actions'
import { DelegateVotesAction, UndelegateVotesAction } from './bHermesVotes/actions'
import { ClaimRewardsAction } from './flywheel/actions'
import { StrategyDepositAction, StrategyRedeemAction } from './talosBaseStrategy'
import { CreateTalosManagerAction } from './talosManagerFactory'
import { CreateTalosOptimizerAction } from './talosOptimizerFactory'
import { CreateTalosStrategyStakedAction } from './talosStrategyStakedFactory'
import { CreateTalosStrategyVanillaAction } from './talosStrategyVanillaFactory'
import {
  ClaimRewardAction,
  CreateIncentiveAction,
  StakeTokenAction,
  UnstakeTokenAction,
} from './uniswapV3Staker/actions'
import { ClaimAllRewardsAction } from './uniswapV3Staker/actions/claimAllRewards'
import {
  ClaimGovernanceAction,
  ClaimMultipleAction,
  ClaimMultipleAmountsAction,
  ClaimPartnerGovernanceAction,
  ClaimWeightAction,
  DepositAction,
  ForfeitGovernanceAction,
  ForfeitMultipleAction,
  ForfeitMultipleAmountsAction,
  ForfeitPartnerGovernanceAction,
  ForfeitWeightAction,
  MintAction,
  RedeemAction,
  WithdrawAction,
} from './vMaia'

/**
 * Holds the functions that create the parameters for the actions that can be made by a user in Hermes
 */
export abstract class UlyssesActions {
  /**
   * Creates the necessary transaction parameters for a simple contract interaction.
   * @param action the action to be executed
   * @param context the context parameters for the action
   * @returns the target contract, encoded calldata and message value to send onchain for the action.
   */
  public static buildSimpleAction(
    action: IAction<any, IActionResult<any>>,
    context: IContextParameters
  ): IActionResult<unknown> {
    // Create the transaction builder
    const transactionBuilder = new ActionBuilder(new ContextHandler(context))

    // Add the action to the transaction
    transactionBuilder.addAction(action)

    // Build the transaction
    const { encodedResults } = transactionBuilder.build()

    // Return the results
    return encodedResults ?? { target: ZERO_ADDRESS, params: { calldata: '', value: '0' } }
  }

  /**
   * Creates the necessary transaction parameters for a complex contract interaction.
   * @param actions set of actions to be executed
   * @param context the context parameters for the actions
   * @returns the target contract, encoded calldata and message value to send onchain for the actions.
   */
  public static buildComplexAction(
    actions: IAction<any, IActionResult<any>>[],
    context: IContextParameters
  ): IActionResult<unknown> {
    // Create the transaction builder
    const transactionBuilder = new ActionBuilder(new ContextHandler(context))

    // Add the actions to the transaction
    actions.forEach((act) => transactionBuilder.addAction(act))

    // Build the transaction
    const { encodedResults } = transactionBuilder.build()

    // Return the results
    return encodedResults ?? { target: ZERO_ADDRESS, params: { calldata: '', value: '0' } }
  }

  // Make me an helper function for this logic const actions = []
  // if (preActions) actions.push(...preActions)
  // actions.push(new BurnHermesAction(params))
  // if (postActions) actions.push(...postActions)
  public static buildComplexActionWithPreAndPostActions(
    actions: IAction<any, IActionResult<any>>[],
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    // Append actions into array if the are pre or post actions
    const allActions = []
    if (preActions) allActions.push(...preActions)
    allActions.push(...actions)
    if (postActions) allActions.push(...postActions)

    // Build complex action
    return this.buildComplexAction(allActions, context)
  }

  /**
   * Creates the necessary execution params for the burning of hermes tokens for bHermes.
   * @param params the parameters for the burn action in bHermes.
   * @param context the context parameters for the burn action.
   * @param preActions the pre actions to be executed right before the burn action.
   * @param postActions the post actions to be executed right after the burn action.
   * @returns the target contract, encoded calldata and message value to send to Branch Router for the burn action.
   */
  public static burnHermesParameters(
    params: TBurnHermesParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new BurnHermesAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the increment of a gauge in bHermesGauges.
   * @param params the parameters for the increment gauge action in bHermesGauges.
   * @param context the context parameters for the increment gauge action.
   * @param preActions the pre actions to be executed right before the increment gauge action.
   * @param postActions the post actions to be executed right after the increment gauge action.
   * @returns the target contract, encoded calldata and message value to send onchain for the increment gauge action.
   */
  public static incrementGaugeParameters(
    params: TIncrementGaugeParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new IncrementGaugeAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the increment multiple gauges in bHermesGauges.
   * @param params the parameters for the increment gauges action in bHermesGauges.
   * @param context the context parameters for the increment gauges action.
   * @param preActions the pre actions to be executed right before the increment gauges action.
   * @param postActions the post actions to be executed right after the increment gauges action.
   * @returns the target contract, encoded calldata and message value to send onchain for the increment gauges action.
   */
  public static incrementGaugesParameters(
    params: TIncrementGaugesParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new IncrementGaugesAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the decrement of a gauge in bHermesGauges.
   * @param params the parameters for the decrement gauge action in bHermesGauges.
   * @param context the context parameters for the decrement gauge action.
   * @param preActions the pre actions to be executed right before the decrement gauge action.
   * @param postActions the post actions to be executed right after the decrement gauge action.
   * @returns the target contract, encoded calldata and message value to send onchain for the decrement gauge action.
   */
  public static decrementGaugeParameters(
    params: TDecrementGaugeParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new DecrementGaugeAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the decrement of multiple gauges in bHermesGauges.
   * @param params the parameters for the decrement gauges action in bHermesGauges.
   * @param context the context parameters for the decrement gauges action.
   * @param preActions the pre actions to be executed right before the decrement gauges action.
   * @param postActions the post actions to be executed right after the decrement gauges action.
   * @returns the target contract, encoded calldata and message value to send onchain for the decrement gauges action.
   */
  public static decrementGaugesParameters(
    params: TDecrementGaugesParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new DecrementGaugesAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the delegation of a gauge in bHermesGauges.
   * @param params the parameters for the delegate action in bHermesGauges.
   * @param context the context parameters for the delegate action.
   * @param preActions the pre actions to be executed right before the delegate action.
   * @param postActions the post actions to be executed right after the delegate action.
   * @returns the target contract, encoded calldata and message value to send onchain for the delegate action.
   */
  public static delegateGaugeParameters(
    params: TDelegateGaugeParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new DelegateGaugeAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the undelegation of a gauge in bHermesGauges.
   * @param params the parameters for the undelegate action in bHermesGauges.
   * @param context the context parameters for the undelegate action.
   * @param preActions the pre actions to be executed right before the undelegate action.
   * @param postActions the post actions to be executed right after the undelegate action.
   * @returns the target contract, encoded calldata and message value to send onchain for the undelegate action.
   */
  public static undelegateGaugeParameters(
    params: TUndelegateGaugeParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new UndelegateGaugeAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the decrement gauge boost action in bHermesBoost.
   * @param params the parameters for the decrement gauge boost action in bHermesBoost.
   * @param context the context parameters for the decrement gauge boost action.
   * @param preActions the pre actions to be executed right before the decrement gauge boost action.
   * @param postActions the post actions to be executed right after the decrement gauge boost action.
   * @returns the target contract, encoded calldata and message value to send onchain for the decrement gauge boost action.
   */
  public static decrementGaugeBoostParameters(
    params: TDecrementGaugeBoostParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new DecrementGaugeBoostAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the decrement gauges all boost action in bHermesBoost.
   * @param params the parameters for the decrement gauges all boost action in bHermesBoost.
   * @param context the context parameters for the decrement gauges all boost action.
   * @param preActions the pre actions to be executed right before the decrement gauges all boost action.
   * @param postActions the post actions to be executed right after the decrement gauges all boost action.
   * @returns the target contract, encoded calldata and message value to send onchain for the decrement gauges all boost action.
   */
  public static decrementGaugeAllBoostParameters(
    params: TDecrementGaugeAllBoostParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new DecrementGaugeAllBoostAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the decrement certain boost from all gauges in bHermesBoost.
   * @param params the parameters for the decrement all gauges boost action in bHermesBoost.
   * @param context the context parameters for the decrement boost all gauges action.
   * @param preActions the pre actions to be executed right before the decrement all gauges boost action.
   * @param postActions the post actions to be executed right after the decrement all gauges boost action.
   * @returns the target contract, encoded calldata and message value to send onchain for the decrement boost all gauges action.
   */
  public static decrementAllGaugesBoostParameters(
    params: TDecrementAllGaugesBoostParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new DecrementAllGaugesBoostAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the decrement gauges boost indexed action in bHermesBoost.
   * @param params the parameters for the decrement gauges boost indexed action in bHermesBoost.
   * @param context the context parameters for the decrement gauges boost indexed action.
   * @param preActions the pre actions to be executed right before the decrement gauges boost indexed action.
   * @param postActions the post actions to be executed right after the decrement gauges boost indexed action.
   * @returns the target contract, encoded calldata and message value to send onchain for the decrement gauges boost indexed action.
   */
  public static decrementGaugesBoostIndexedParameters(
    params: TDecrementGaugesBoostIndexedParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new DecrementGaugesBoostIndexedAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the decrement all gauges all boost action in bHermesBoost.
   * @param params the parameters for the decrement all gauges all boost action in bHermesBoost.
   * @param context the context parameters for the decrement all gauges all boost action.
   * @param preActions the pre actions to be executed right before the decrement all gauges all boost action.
   * @param postActions the post actions to be executed right after the decrement all gauges all boost action.
   * @returns the target contract, encoded calldata and message value to send onchain for the decrement all gauges all boost action.
   */
  public static decrementAllGaugesAllBoostParameters(
    params: TDecrementAllGaugesBoostParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new DecrementAllGaugesAllBoostAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the delegation of governance power in bHermesVotes.
   * @param params the parameters for the delegate action in bHermesVotes.
   * @param context the context parameters for the delegate action.
   * @param preActions the pre actions to be executed right before the delegate action.
   * @param postActions the post actions to be executed right after the delegate action.
   * @returns the target contract, encoded calldata and message value to send onchain for the delegate action.
   */
  public static delegateVotesParameters(
    params: TDelegateVotesParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new DelegateVotesAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the undelegation of governance power in bHermesVotes.
   * @param params the parameters for the undelegate action in bHermesVotes.
   * @param context the context parameters for the undelegate action.
   * @param preActions the pre actions to be executed right before the undelegate action.
   * @param postActions the post actions to be executed right after the undelegate action.
   * @returns the target contract, encoded calldata and message value to send onchain for the undelegate action.
   */
  public static undelegateVotesParameters(
    params: TUndelegateVotesParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new UndelegateVotesAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params to claim rewards from a flywheel contract.
   * @param flywheel the address of the flywheel contract.
   * @param recipient the recipient for the claim rewards.
   * @param context the context parameters for the claim rewards action.
   * @param preActions the pre actions to be executed right before the claim rewards action.
   * @param postActions the post actions to be executed right after the claim rewards action.
   * @returns the target contract, encoded calldata and message value to send onchain for the claim rewards action.
   */
  public static claimRewardsParameters(
    flywheel: string,
    recipient: string,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new ClaimRewardsAction(flywheel, recipient)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the deposit into a Talos Strategy contract.
   * @param strategy the address of the strategy to deposit into.
   * @param params the parameters for the strategy deposit action in Talos Strategy.
   * @param context the context parameters for the strategy deposit action.
   * @param preActions the pre actions to be executed right before the strategy deposit action.
   * @param postActions the post actions to be executed right after the strategy deposit action.
   * @returns the target contract, encoded calldata and message value to send onchain for the strategy deposit action.
   */
  public static strategyDepositParameters(
    strategy: string,
    params: TStrategyDepositParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new StrategyDepositAction(strategy, params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the redeem from a Talos Strategy contract.
   * @param strategy the address of the strategy to redeem from.
   * @param params the parameters for the strategy redeem action in Talos Strategy.
   * @param context the context parameters for the strategy redeem action.
   * @param preActions the pre actions to be executed right before the strategy redeem action.
   * @param postActions the post actions to be executed right after the strategy redeem action.
   * @returns the target contract, encoded calldata and message value to send onchain for the strategy redeem action.
   */
  public static strategyRedeemParameters(
    strategy: string,
    params: TStrategyRedeemParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new StrategyRedeemAction(strategy, params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the creation of a Talos Manager.
   * @param params the parameters for the create Talos Manager action in Talos Manager Factory.
   * @param context the context parameters for the create Talos Manager action.
   * @param preActions the pre actions to be executed right before the create Talos Manager action.
   * @param postActions the post actions to be executed right after the create Talos Manager action.
   * @returns the target contract, encoded calldata and message value to send onchain for the create Talos Manager action.
   */
  public static createTalosManagerParameters(
    params: TCreateTalosManagerParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new CreateTalosManagerAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the creation of a Talos Optimizer.
   * @param params the parameters for the create Talos Optimizer action in Talos Optimizer Factory.
   * @param context the context parameters for the create Talos Optimizer action.
   * @param preActions the pre actions to be executed right before the create Talos Optimizer action.
   * @param postActions the post actions to be executed right after the create Talos Optimizer action.
   * @returns the target contract, encoded calldata and message value to send onchain for the create Talos Optimizer action.
   */
  public static createTalosOptimizerParameters(
    params: TCreateTalosOptimizerParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new CreateTalosOptimizerAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the creation of a Talos Strategy Staked.
   * @param params the parameters for the create Talos Strategy Staked action in Talos Strategy Staked Factory.
   * @param context the context parameters for the create Talos Strategy Staked action.
   * @param preActions the pre actions to be executed right before the create Talos Strategy Staked action.
   * @param postActions the post actions to be executed right after the create Talos Strategy Staked action.
   * @returns the target contract, encoded calldata and message value to send onchain for the create Talos Strategy Staked action.
   */
  public static createTalosStrategyStakedParameters(
    params: TCreateTalosStrategyStakedParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new CreateTalosStrategyStakedAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the creation of a Talos Strategy Vanilla.
   * @param params the parameters for the create Talos Strategy Vanilla action in Talos Strategy Vanilla Factory.
   * @param context the context parameters for the create Talos Strategy Vanilla action.
   * @param preActions the pre actions to be executed right before the create Talos Strategy Vanilla action.
   * @param postActions the post actions to be executed right after the create Talos Strategy Vanilla action.
   * @returns the target contract, encoded calldata and message value to send onchain for the create Talos Strategy Vanilla action.
   */
  public static createTalosStrategyVanillaParameters(
    params: TCreateTalosStrategyVanillaParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new CreateTalosStrategyVanillaAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for incentivizing a univ3 pool via our UniswapV3Stakers contract.
   * @param params the parameters for the create incentive action in UniswapV3Staker.
   * @param context the context parameters for the create incentive action.
   * @param preActions the pre actions to be executed right before the create incentive action.
   * @param postActions the post actions to be executed right after the create incentive action.
   * @returns the target contract, encoded calldata and message value to send onchain for the create incentive action.
   */
  public static createIncentiveParameters(
    params: TCreateIncentiveParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new CreateIncentiveAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for claiming the rewards from a single univ3 position staked in the gauge.
   * @param params the parameters for the claim reward action in UniswapV3Staker.
   * @param context the context parameters for the claim reward action.
   * @param preActions the pre actions to be executed right before the claim reward action.
   * @param postActions the post actions to be executed right after the claim reward action.
   * @returns the target contract, encoded calldata and message value to send onchain for the claim reward action.
   */
  public static claimRewardParameters(
    params: TClaimRewardParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new ClaimRewardAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for claiming the rewards from multiple univ3 positions staked in the gauge.
   * @param params the parameters for the claim all rewards action in UniswapV3Staker.
   * @param context the context parameters for the claim all rewards action.
   * @param preActions the pre actions to be executed right before the claim all rewards action.
   * @param postActions the post actions to be executed right after the claim all rewards action.
   * @returns the target contract, encoded calldata and message value to send onchain for the claim all rewards action.
   */
  public static claimAllRewardsParameters(
    params: TClaimAllRewardsParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new ClaimAllRewardsAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for staking a univ3 position in the gauge.
   * @param params the parameters for the stake token action in UniswapV3Staker.
   * @param context the context parameters for the stake token action.
   * @param preActions the pre actions to be executed right before the stake token action.
   * @param postActions the post actions to be executed right after the stake token action.
   * @returns the target contract, encoded calldata and message value to send onchain for the stake token action.
   */
  public static stakeTokenParameters(
    params: TStakeTokenParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new StakeTokenAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for unstaking a univ3 position in the gauge.
   * @param params the parameters for the unstake token action in UniswapV3Staker.
   * @param context the context parameters for the unstake token action.
   * @param preActions the pre actions to be executed right before the unstake token action.
   * @param postActions the post actions to be executed right after the unstake token action.
   * @returns the target contract, encoded calldata and message value to send onchain for the unstake token action.
   */
  public static unstakeTokenParameters(
    params: TUnstakeTokenParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new UnstakeTokenAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for depositing $Maia in exchange for $vMaia in the Vote Maia contract.
   * @param params the parameters for the deposit action in Vote Maia.
   * @param context the context parameters for the deposit action.
   * @param preActions the pre actions to be executed right before the deposit action.
   * @param postActions the post actions to be executed right after the deposit action.
   * @returns the target contract, encoded calldata and message value to send onchain for the deposit action.
   */
  public static depositMaiaParameters(
    params: TDepositParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions([new DepositAction(params)], context, preActions, postActions)
  }

  /**
   * Creates the necessary execution params for minting $vMaia in exchange for $Maia in the Vote Maia contract.
   * @param params the parameters for the Mint action in Vote Maia.
   * @param context the context parameters for the Mint action.
   * @param preActions the pre actions to be executed right before the Mint action.
   * @param postActions the post actions to be executed right after the Mint action.
   * @returns the target contract, encoded calldata and message value to send onchain for the Mint action.
   */
  public static MintMaiaParameters(
    params: TMintParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions([new MintAction(params)], context, preActions, postActions)
  }

  /**
   * Creates the necessary execution params for withdrawing $Maia in exchange for $vMaia in the Vote Maia contract.
   * @param params the parameters for the Withdraw action in Vote Maia.
   * @param context the context parameters for the Withdraw action.
   * @param preActions the pre actions to be executed right before the Withdraw action.
   * @param postActions the post actions to be executed right after the Withdraw action.
   * @returns the target contract, encoded calldata and message value to send onchain for the Withdraw action.
   */
  public static WithdrawMaiaParameters(
    params: TWithdrawParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions([new WithdrawAction(params)], context, preActions, postActions)
  }

  /**
   * Creates the necessary execution params for redeeming $vMaia in exchange for $Maia in the Vote Maia contract.
   * @param params the parameters for the Redeem action in Vote Maia.
   * @param context the context parameters for the Redeem action.
   * @param preActions the pre actions to be executed right before the Redeem action.
   * @param postActions the post actions to be executed right after the Redeem action.
   * @returns the target contract, encoded calldata and message value to send onchain for the Redeem action.
   */
  public static RedeemMaiaParameters(
    params: TRedeemParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions([new RedeemAction(params)], context, preActions, postActions)
  }

  /**
   * Creates the necessary execution params for the claim of governance utility tokens from the Vote Maia contract.
   * @param params the parameters for the claim governance utility tokens action in Vote Maia.
   * @param context the context parameters for the claim governance utility tokens action.
   * @param preActions the pre actions to be executed right before the claim governance utility tokens action.
   * @param postActions the post actions to be executed right after the claim governance utility tokens action.
   * @returns the target contract, encoded calldata and message value to send onchain for the claim governance utility tokens action.
   */
  public static claimGovernanceParameters(
    params: TClaimParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new ClaimGovernanceAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the claim of Weight utility tokens from the Vote Maia contract.
   * @param params the parameters for the claim Weight utility tokens action in Vote Maia.
   * @param context the context parameters for the claim Weight utility tokens action.
   * @param preActions the pre actions to be executed right before the claim Weight utility tokens action.
   * @param postActions the post actions to be executed right after the claim Weight utility tokens action.
   * @returns the target contract, encoded calldata and message value to send onchain for the claim Weight utility tokens action.
   */
  public static claimWeightParameters(
    params: TClaimParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new ClaimWeightAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the claim of Maia Governance utility tokens from the Vote Maia contract.
   * @param params the parameters for the claim Maia Governance utility tokens action in Vote Maia.
   * @param context the context parameters for the claim Maia Governance utility tokens action.
   * @param preActions the pre actions to be executed right before the claim Maia Governance utility tokens action.
   * @param postActions the post actions to be executed right after the claim Maia Governance utility tokens action.
   * @returns the target contract, encoded calldata and message value to send onchain for the claim Maia Governance utility tokens action.
   */
  public static claimPartnerGovernanceParameters(
    params: TClaimParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new ClaimPartnerGovernanceAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the claim of of multiple utility tokens from the Vote Maia contract.
   * @param params the parameters for the claim of multiple utility tokens action in Vote Maia.
   * @param context the context parameters for the claim of multiple utility tokens action.
   * @param preActions the pre actions to be executed right before the claim of multiple utility tokens action.
   * @param postActions the post actions to be executed right after the claim of multiple utility tokens action.
   * @returns the target contract, encoded calldata and message value to send onchain for the claim of multiple utility tokens action.
   */
  public static claimMultipleParameters(
    params: TClaimParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new ClaimMultipleAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the claim of of multiple utility tokens from the Vote Maia contract.
   * @param params the parameters for the claim of multiple utility tokens action in Vote Maia.
   * @param context the context parameters for the claim of multiple utility tokens action.
   * @param preActions the pre actions to be executed right before the claim of multiple utility tokens action.
   * @param postActions the post actions to be executed right after the claim of multiple utility tokens action.
   * @returns the target contract, encoded calldata and message value to send onchain for the claim of multiple utility tokens action.
   */
  public static claimMultipleAmountsParameters(
    params: TClaimMultipleAmountsParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new ClaimMultipleAmountsAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the Forfeit of governance utility tokens from the Vote Maia contract.
   * @param params the parameters for the Forfeit governance utility tokens action in Vote Maia.
   * @param context the context parameters for the Forfeit governance utility tokens action.
   * @param preActions the pre actions to be executed right before the Forfeit governance utility tokens action.
   * @param postActions the post actions to be executed right after the Forfeit governance utility tokens action.
   * @returns the target contract, encoded calldata and message value to send onchain for the Forfeit governance utility tokens action.
   */
  public static forfeitGovernanceParameters(
    params: TForfeitParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new ForfeitGovernanceAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the Forfeit of Weight utility tokens from the Vote Maia contract.
   * @param params the parameters for the Forfeit Weight utility tokens action in Vote Maia.
   * @param context the context parameters for the Forfeit Weight utility tokens action.
   * @param preActions the pre actions to be executed right before the Forfeit Weight utility tokens action.
   * @param postActions the post actions to be executed right after the Forfeit Weight utility tokens action.
   * @returns the target contract, encoded calldata and message value to send onchain for the Forfeit Weight utility tokens action.
   */
  public static forfeitWeightParameters(
    params: TForfeitParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new ForfeitWeightAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the Forfeit of Maia Governance utility tokens from the Vote Maia contract.
   * @param params the parameters for the Forfeit Maia Governance utility tokens action in Vote Maia.
   * @param context the context parameters for the Forfeit Maia Governance utility tokens action.
   * @param preActions the pre actions to be executed right before the Forfeit Maia Governance utility tokens action.
   * @param postActions the post actions to be executed right after the Forfeit Maia Governance utility tokens action.
   * @returns the target contract, encoded calldata and message value to send onchain for the Forfeit Maia Governance utility tokens action.
   */
  public static forfeitPartnerGovernanceParameters(
    params: TForfeitParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new ForfeitPartnerGovernanceAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the Forfeit of of multiple utility tokens from the Vote Maia contract.
   * @param params the parameters for the Forfeit of multiple utility tokens action in Vote Maia.
   * @param context the context parameters for the Forfeit of multiple utility tokens action.
   * @param preActions the pre actions to be executed right before the Forfeit of multiple utility tokens action.
   * @param postActions the post actions to be executed right after the Forfeit of multiple utility tokens action.
   * @returns the target contract, encoded calldata and message value to send onchain for the Forfeit of multiple utility tokens action.
   */
  public static forfeitMultipleParameters(
    params: TForfeitParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new ForfeitMultipleAction(params)],
      context,
      preActions,
      postActions
    )
  }

  /**
   * Creates the necessary execution params for the Forfeit of of multiple utility tokens from the Vote Maia contract.
   * @param params the parameters for the Forfeit of multiple utility tokens action in Vote Maia.
   * @param context the context parameters for the Forfeit of multiple utility tokens action.
   * @param preActions the pre actions to be executed right before the Forfeit of multiple utility tokens action.
   * @param postActions the post actions to be executed right after the Forfeit of multiple utility tokens action.
   * @returns the target contract, encoded calldata and message value to send onchain for the Forfeit of multiple utility tokens action.
   */
  public static forfeitMultipleAmountsParameters(
    params: TForfeitMultipleAmountsParams,
    context: IContextParameters,
    preActions?: IAction<any, IActionResult<any>>[],
    postActions?: IAction<any, IActionResult<any>>[]
  ): IActionResult<unknown> {
    return this.buildComplexActionWithPreAndPostActions(
      [new ForfeitMultipleAmountsAction(params)],
      context,
      preActions,
      postActions
    )
  }
}
