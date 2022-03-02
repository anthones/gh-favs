import axios from "axios";
import { Dispatch } from "redux";
import { ActionTypes, Repo, ThunkActions } from "./types";

const getURL = (): string => {
  let date = new Date(),
    offset;
  date.setDate(date.getDate() - 5);
  offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return `https://api.github.com/search/repositories?q=created:%3E${
    date.toISOString().split("T")[0]
  }&sort=stars&order=desc`;
};

export interface FetchReposAction {
  type: ActionTypes.fetchRepos;
  payload: Repo[];
}

export interface addFavouriteAction {
  type: ActionTypes.addFavourite;
  payload: number;
}

export interface removeFavouriteAction {
  type: ActionTypes.removeFavourite;
  payload: number;
}

export const fetchRepos = (): ThunkActions<FetchReposAction> => {
  return async (dispatch: Dispatch): Promise<void> => {
    const response = await axios.get<{ items: Repo[] }>(getURL()!);
    const local = JSON.parse(localStorage.getItem("favourites")!) || [];

    dispatch<FetchReposAction>({
      type: ActionTypes.fetchRepos,
      payload: [...response.data.items, ...local],
    });
  };
};

export const addFavourite = (
  repoId: number,
  repo: Repo
): ThunkActions<addFavouriteAction> => {
  return async (dispatch: Dispatch): Promise<void> => {
    const local = JSON.parse(localStorage.getItem("favourites")!);
    if (
      !(local && local.length && local.some(({ id }: Repo) => id === repoId))
    ) {
      localStorage.setItem(
        "favourites",
        JSON.stringify([
          ...(local ? local : []),
          { ...repo, isFavourited: true },
        ])
      );
    }

    dispatch<addFavouriteAction>({
      type: ActionTypes.addFavourite,
      payload: repoId,
    });
  };
};

export const removeFavourite = (
  repoId: number
): ThunkActions<removeFavouriteAction> => {
  return async (dispatch: Dispatch): Promise<void> => {
    const local = localStorage.getItem("favourites")!;
    const newLocal = JSON.parse(local).filter(({ id }: Repo) => id !== repoId);
    localStorage.setItem("favourites", JSON.stringify(newLocal));

    dispatch<removeFavouriteAction>({
      type: ActionTypes.removeFavourite,
      payload: repoId,
    });
  };
};
