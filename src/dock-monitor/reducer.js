export const TOGGLE_VISIBILITY = '@@redux-ng-devtools/TOGGLE_VISIBILITY';

export function toggleVisibility() {
  return {type: TOGGLE_VISIBILITY};
}

export function isVisible(state = true, action) {
  return action.type === TOGGLE_VISIBILITY ? !state : state;
}

export default function (state = {}, action) {
  return {
    isVisible: isVisible(state.isVisible, action)
  };
}
