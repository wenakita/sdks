import { IAction, IActionResult } from '../action'
import { IActionContext } from '../actionContext'

/**
 * @title ActionBuilder
 * @notice A builder class for creating a batch of actions to be executed onchain.
 * @author MaiaDAO
 */
export class ActionBuilder<TParams, TResult> {
  private actions: IAction<TParams, TResult>[] = []
  private context: IActionContext<TParams, TResult>

  constructor(context: IActionContext<TParams, TResult>) {
    this.context = context
  }

  addAction(action: IAction<TParams, TResult>): ActionBuilder<TParams, TResult> {
    this.actions.push(action)
    return this
  }

  build(): { results: IActionResult<TResult>[]; encodedResults?: IActionResult<TResult> } {
    // eslint-disable-next-line prefer-const
    let results: IActionResult<TResult>[] = []

    for (const action of this.actions) {
      // Perform any necessary pre-checks or adjustments
      this.beforeEncode()

      // Encode action with context
      const result = this.context.encodeAction(action, action.params)

      // Store result for further processing
      results.push(result)

      // Optionally, adjust context or the results array for subsequent actions
      this.afterEncode()
    }

    return { results, encodedResults: this.context.wrapCalldata(results) }
  }

  private beforeEncode(): void {
    // Implement checks such as invariant validations here
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private afterEncode(): void {
    // Adjust the context based on previous action's result if necessary
  }
}
