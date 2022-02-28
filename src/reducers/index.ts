import { combineReducers } from "redux";
import { ReposReducer } from "./repos";
import { Repo } from "../actions";

export interface StoreState {
  repos: Repo[];
}

export const reducers = combineReducers<StoreState>({
  repos: ReposReducer
} as any);