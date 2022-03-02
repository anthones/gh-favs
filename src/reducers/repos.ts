import { Repo, Action, ActionTypes, FetchReposAction } from "../actions";

export const ReposReducer = (state: Repo[] = [], { type, payload }: Action) => {
  switch (type) {
    case ActionTypes.fetchRepos:
      return (payload as FetchReposAction["payload"]).map(
        ({ id, name, html_url, description, stargazers_count, language }) => ({
          id,
          name,
          html_url,
          description,
          stargazers_count,
          language,
        })
      );
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
