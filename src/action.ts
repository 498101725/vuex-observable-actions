import { ActionContext } from 'vuex'
import { Observable, filter, catchError, tap } from 'rxjs'

export interface EpicAction {
  type: string
  payload?: any
}

export type ObservableAction = Epic<
  EpicAction,
  EpicAction,
  ActionContext<any, any>
>

export declare type Epic<
  Input extends EpicAction = any,
  Output extends Input = Input,
  Dependencies extends ActionContext<any, any> = any
 = (event: Observable<Input>, dependencies: Dependencies) => Observable<Output>

export type ActionHandler = (event: EpicAction) => void

export interface ObservableActionOptions {
  onActionStarted?: ActionHandler
  onActionFinished?: ActionHandler
  onError?: (error: Error) => void
}

export const makeAction = (
  name: string,
  action: ObservableAction,
  options: ObservableActionOptions
): ObservableAction => {
  if (!name || typeof name !== 'string') {
    throw new Error(`Name of the action is invalid!`)
  }
  if (!action) {
    throw new Error(`Action "${name}" is specified without defination`)
  }
  const { onActionStarted, onActionFinished, onError } = options
  return (action$: Observable<EpicAction>, deps$) => {
    return action(
      action$.pipe(
        // put identity here for all epics to be registered to the name
        filter(({ type }) => type === name),
        tap((action: EpicAction) => onActionStarted(action))
      ),
      deps$
    ).pipe(
      tap((action: EpicAction) => onActionFinished(action)),
      catchError((error, source) => {
        onError(error)
        return source
      })
    )
  }
}
