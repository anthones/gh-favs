import { Repo, Action, ActionTypes, FetchReposAction } from "../actions";

export const ReposReducer = (state: Repo[] = [], { type, payload }: Action) => {
  switch (type) {
    case ActionTypes.fetchRepos:
      return reduceRepos(payload as FetchReposAction["payload"]);
    case ActionTypes.addFavourite:
      return state.map((repo) =>
        repo.id === payload ? { ...repo, isFavourited: true } : repo
      );
    case ActionTypes.removeFavourite:
      return state.map((repo) =>
        repo.id === payload ? { ...repo, isFavourited: false } : repo
      );
    default:
      return state;
  }
};

const reduceRepos = (repos: Repo[]) => {
  const localRepos = JSON.parse(localStorage.getItem("favourites")!) || [];
  const ids = new Set(localRepos.map(({ id }: Repo) => id));

  return [
    ...localRepos,
    ...repos.filter(({ id }: Repo) => ids && !ids.has(id)),
  ].map(
    ({
      id,
      name,
      html_url,
      language,
      description,
      isFavourited,
      stargazers_count,
    }) => ({
      id,
      name,
      html_url,
      language,
      description,
      isFavourited,
      stargazers_count,
    })
  );
};
