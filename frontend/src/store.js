import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
}

// Action types
const SET_SIDEBAR_SHOW = 'SET_SIDEBAR_SHOW'
const SET_THEME = 'SET_THEME'

const changeState = (state = initialState, action) => {
  switch (action.type) {
    case SET_SIDEBAR_SHOW:
      return { ...state, sidebarShow: action.payload }
    case SET_THEME:
      return { ...state, theme: action.payload }
    case 'set':
      return { ...state, ...action }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
