import {
  merge,
  Subject,
  map,
  mergeMap,
  from,
  subscribeOn,
  observeOn,
  queueScheduler,
} from 'rxjs'
import {
  EpicAction,
  ObservableActionOptions,
  makeAction,
  Epic,
} from './action'

export interface EpicMap {
  [name: string]: Epic
}

export default (epics: EpicMap, options: ObservableActionOptions = {}) => {
  const QueueScheduler: any = queueScheduler.constructor
  const uniqueQueueScheduler: typeof queueScheduler = new QueueScheduler(
    (queueScheduler as any).schedulerActionCtor
  )
  const actionSubject$ = new Subject<any>()
  const epic$ = new Subject<Epic<any>>()
  const action$ = actionSubject$
    .asObservable()
    .pipe(observeOn(uniqueQueueScheduler))

  const observableActions = []
  Object.entries(epics).forEach(([type, epic]: [string, Epic]) => {
    observableActions.push(makeAction(type, epic, options))
  })
  return store => {
    const { commit, dispatch, getters, rootState, rootGetters, state } = store
    store._actions = new Proxy(store._actions, {
      get(actions, type) {
        return (
          actions[type] || [payload =>
              Promise.resolve(
                actionSubject$.next({
                  type,
                  payload,
                })
              ),
          ]
        )
      },
    })
    epic$
      .pipe(
        map(epic => {
          const output$ = epic(action$, state, {
            dispatch,
            commit,
            getters,
            rootState,
            rootGetters,
          })
          if (!output$) {
            throw new TypeError(
              `Your root epic "${
                epic.name || '<anonymous>'
              }" does not return a piped stream. Double check you\'re not missing a return statement!`
            )
          }
          return output$
        }),
        mergeMap(output$ =>
          from(output$).pipe(
            subscribeOn(uniqueQueueScheduler),
            observeOn(uniqueQueueScheduler)
          )
        )
      )
      .subscribe(({ type, payload }: EpicAction) => {
        if (!type) {
          throw new TypeError(
            `type is missing at the end of a piped operators, you need to specify the mutation name (including namespace if exists) as type`
          )
        }
        commit(type, payload)
      })
    epic$.next((...args: Parameters<Epic>) => {
      return merge(...observableActions.map(epic => epic(...args)))
    })
  }
}
