/*
 * @Description: 公用信息
 * @Version: 0.1.0
 * @Author: AiDongYang
 * @Date: 2021-10-21 17:30:02
 * @LastEditors: AiDongYang
 * @LastEditTime: 2021-10-22 16:15:59
 */
function registerGlobalModule(store, props = {}) {
  if (!store) {
    return
  }

  // 获取初始化的state
  const state = (props.getGlobalState && props.getGlobalState()) || {
    ...props
  }

  // 声明mutations
  const mutations = {
    // 设置state
    setGlobalState(state, payload) {
      state = Object.assign(state, payload)
    },
    // 通知主应用更改state
    emitGlobalState(state, payload) {
      state = Object.assign(state, payload)
      props.setGlobalState && props.setGlobalState(state)
    }
  }

  // 声明actions
  const actions = {
    setGlobalState({ commit }, payload) {
      commit(
        props.setGlobalState ? 'emitGlobalState' : 'setGlobalState',
        payload
      )
    },
    initGlobalState({ commit }, payload) {
      commit('setGlobalState', payload)
    }
  }

  // 将主应用的数据存储到微应用中 并将命名空间固定位global
  if (!store.hasModule('global')) {
    const globalModule = {
      namespaced: true,
      state,
      mutations,
      actions
    }

    store.registerModule('global', globalModule)
  } else {
    // 如果微应用没有注册过global 那么每次mount时 就同步一次主应用数据
    store.dispatch('global/initGlobalState', state)
  }

  // 如果不是独立运行 就监听数据变化 让主应用更改状态
  props.onGlobalStateChange &&
    props.onGlobalStateChange(newState => {
      store.commit('global/setGlobalState', newState)
    })
}

export default registerGlobalModule
