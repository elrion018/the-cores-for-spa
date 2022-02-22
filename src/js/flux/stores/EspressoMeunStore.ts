import { Store, Reducer } from "../../cores";
import { StoreState } from "../../cores/Store";

const ADD_MENU = "addMenu";
const EDIT_MENU = "editMenu";
const REMOVE_MENU = "removeMenu";

export class EspressoMenuStore extends Store {
  state: StoreState;

  constructor(reducer: Reducer) {
    super(reducer);

    this.state = {
      menu: [],
      menuId: 0,
    };

    this.reducer.setActions({
      [ADD_MENU]: function (
        state: StoreState,
        payload: {
          newMenu: string;
        }
      ) {
        const { newMenu } = payload;

        return {
          ...state,
          menu: [...state.menu, { name: newMenu, id: state.menuId }],
          menuId: state.menuId + 1,
        };
      },

      [EDIT_MENU]: function (state: StoreState, payload) {
        const { targetMenuIndex, newName } = payload;
        const copiedMenu = [...state.menu];
        copiedMenu[targetMenuIndex].name = newName.toLowerCase();

        return {
          ...state,
          menu: copiedMenu,
        };
      },

      [REMOVE_MENU]: function (state: StoreState, payload) {
        const { targetMenuIndex } = payload;
        const copiedMenu = [...state.menu];

        copiedMenu.splice(targetMenuIndex, 1);

        return {
          ...state,
          menu: copiedMenu,
        };
      },
    });
  }
}
