// entities/route.ts

import {
  ComposableStablePool,
  ComposableStablePoolWrapper,
  Pair,
  Pool,
  Route as V3RouteSDK,
  V2RouteSDK,
} from 'hermes-v2-sdk'
import { Currency, NativeToken, Price } from 'maia-core-sdk'

import { MixedRouteSDK, TPool as TypePool } from './mixedRoute/route'
import { Protocol } from './protocol'

export interface IRoute<TInput extends Currency, TOutput extends Currency, TPool extends TypePool> {
  protocol: Protocol
  // array of pools if v3 or pairs if v2 or composable stable pools if balancer
  pools: TPool[]
  path: NativeToken[]
  midPrice: Price<TInput, TOutput>
  input: TInput
  output: TOutput
}

// V2 route wrapper
export class RouteV2<TInput extends Currency, TOutput extends Currency>
  extends V2RouteSDK<TInput, TOutput>
  implements IRoute<TInput, TOutput, Pair>
{
  public readonly protocol: Protocol = Protocol.V2
  public readonly pools: Pair[]

  constructor(v2Route: V2RouteSDK<TInput, TOutput>) {
    super(v2Route.pairs, v2Route.input, v2Route.output)
    this.pools = this.pairs
  }
}

// V3 route wrapper
export class RouteV3<TInput extends Currency, TOutput extends Currency>
  extends V3RouteSDK<Pool, TInput, TOutput>
  implements IRoute<TInput, TOutput, Pool>
{
  public readonly protocol: Protocol = Protocol.V3
  public readonly path: NativeToken[]

  constructor(v3Route: V3RouteSDK<Pool, TInput, TOutput>) {
    super(v3Route.pools, v3Route.input, v3Route.output)
    this.path = v3Route.tokenPath
  }
}

// Balancer Composable Stable Pool route wrapper
export class RouteStable<TInput extends Currency, TOutput extends Currency>
  extends V3RouteSDK<ComposableStablePool, TInput, TOutput>
  implements IRoute<TInput, TOutput, ComposableStablePool>
{
  public readonly protocol: Protocol = Protocol.BAL_STABLE
  public readonly path: NativeToken[]

  constructor(stableRoute: V3RouteSDK<ComposableStablePool, TInput, TOutput>) {
    super(stableRoute.pools, stableRoute.input, stableRoute.output)
    this.path = stableRoute.tokenPath
  }
}

// Balancer Composable Stable Pool route wrapper
export class RouteStableWrapper<TInput extends Currency, TOutput extends Currency>
  extends V3RouteSDK<ComposableStablePoolWrapper, TInput, TOutput>
  implements IRoute<TInput, TOutput, ComposableStablePoolWrapper>
{
  public readonly protocol: Protocol = Protocol.BAL_STABLE_WRAPPER
  public readonly path: NativeToken[]

  constructor(stableRoute: V3RouteSDK<ComposableStablePoolWrapper, TInput, TOutput>) {
    super(stableRoute.pools, stableRoute.input, stableRoute.output)
    this.path = stableRoute.tokenPath
  }
}

// Mixed route wrapper
export class MixedRoute<TInput extends Currency, TOutput extends Currency>
  extends MixedRouteSDK<TInput, TOutput>
  implements IRoute<TInput, TOutput, TypePool>
{
  public readonly protocol: Protocol = Protocol.MIXED

  constructor(mixedRoute: MixedRouteSDK<TInput, TOutput>) {
    super(mixedRoute.pools, mixedRoute.input, mixedRoute.output)
  }
}
