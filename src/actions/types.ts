import { ThunkAction } from "redux-thunk";
import { StoreState } from "../reducers";
import {
  FetchReposAction,
  addFavouriteAction,
  removeFavouriteAction,
} from "./repos";

export enum ActionTypes {
  fetchRepos,
  addFavourite,
  removeFavourite,
}

export type Action =
  | FetchReposAction
  | addFavouriteAction
  | removeFavouriteAction;

export type ThunkActions<T extends Action> = ThunkAction<
  Promise<void>,
  StoreState,
  void,
  T
>;

export interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  isFavourited?: boolean;
  stargazers_count: number;
  language: string | string[];
}
