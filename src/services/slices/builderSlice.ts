import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type TBuilderState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBuilderState = {
  bun: null,
  ingredients: []
};

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredients) => {
        const id = nanoid();
        return { payload: { ...ingredients, id } };
      }
    },
    clearIngredients: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    setBun: (state, action: PayloadAction<TIngredient | null>) => {
      state.bun = action.payload;
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingr) => ingr.id !== action.payload
      );
    },
    moveIngredient(
      state,
      action: PayloadAction<{ index: number; upwards: boolean }>
    ) {
      const ingredientLink = state.ingredients[action.payload.index];

      if (action.payload.upwards) {
        state.ingredients[action.payload.index] =
          state.ingredients[action.payload.index - 1];
        state.ingredients[action.payload.index - 1] = ingredientLink;
      } else {
        state.ingredients[action.payload.index] =
          state.ingredients[action.payload.index + 1];
        state.ingredients[action.payload.index + 1] = ingredientLink;
      }
    }
  }
});
export const {
  addIngredient,
  setBun,
  clearIngredients,
  removeIngredient,
  moveIngredient
} = builderSlice.actions;
export default builderSlice.reducer;
