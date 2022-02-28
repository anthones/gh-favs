import React from "react";
import { connect } from "react-redux";

import {
  Repo,
  fetchRepos,
  addFavourite,
  removeFavourite,
  Action,
} from "../actions";
import { StoreState } from "../reducers";
import Loader from "./Loader";
import { Heart } from "./Heart";
import "./App.css";
import { ThunkDispatch } from "redux-thunk";

interface AppProps {
  repos: Repo[];
  fetchRepos: () => Promise<void>;
  addFavourite: (repoId: number, repo: Repo) => Promise<void>;
  removeFavourite: (repoId: number) => Promise<void>;
}

interface AppState {
  fetching: boolean;
  showFavourites: boolean;
  repos: Repo[];
}

const thStyle =
  "bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell";
const tdStyle =
  "p-2 md:border md:border-grey-500 text-left block md:table-cell";
const spanStyle = "inline-block w-1/3 md:hidden font-bold";

class _App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      fetching: false,
      showFavourites: false,
      repos: [],
    };
  }

  componentDidUpdate(prevProps: AppProps, prevState: AppState): void {
    if (!prevProps.repos.length && this.props.repos.length) {
      this.setState({
        fetching: false,
        repos: this.getRepos(),
      });
    }
  }

  componentDidMount(): void {
    this.props.fetchRepos();
    this.setState({ fetching: true });
  }

  private getRepos = () => {
    const map = new Map();
    const local = JSON.parse(localStorage.getItem("favourites")!);

    [...this.props.repos, ...(local ? [local] : [])].forEach(
      ({ id, isFavourited }, i, arr) => {
        if (!map.has(id)) {
          map.set(id, arr[i]);
        } else if (map.has(isFavourited)) {
          map.set(isFavourited, arr[i]);
        }
      }
    );

    return Array.from(map.values());
  };

  private showFavourites = () => {
    this.setState({
      repos: this.state.showFavourites
        ? this.state.repos.filter(({ isFavourited }: Repo) => isFavourited)
        : this.getRepos(),
      showFavourites: !this.state.showFavourites,
    });
  };

  private addFavourite = (id: number, repo: Repo): void => {
    this.props.addFavourite(id, repo);
    this.setState({ repos: this.getRepos() });
  };

  private removeFavourite = (id: number): void => {
    this.props.removeFavourite(id);
    this.setState({ repos: this.getRepos() });
  };

  renderTable() {
    console.log(this.state.repos);
    return (
      <table className="min-w-full border-collapse block md:table">
        <thead className="block md:table-header-group">
          <tr className="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto  md:relative ">
            <th className={thStyle}>Name</th>
            <th className={thStyle}>Description</th>
            <th className={thStyle}>Language</th>
            <th className={thStyle}>Stars</th>
            <th className={thStyle}>
              Favourite{" "}
              <button
                onClick={this.showFavourites}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 border border-yellow-500 rounded"
              >
                Toggle Favourites
              </button>
            </th>
            <th className={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {this.state.repos.length
            ? this.state.repos.map(
                (
                  {
                    id,
                    name,
                    html_url,
                    language,
                    description,
                    isFavourited,
                    stargazers_count,
                  }: Repo,
                  i,
                  arr
                ) => {
                  return (
                    <tr
                      key={i}
                      className={`${
                        i % 2 === 0 ? "bg-white" : "bg-gray-100"
                      } border border-grey-300 md:border-none block md:table-row`}
                    >
                      <td className={tdStyle}>
                        <a href={html_url}>
                          <span className={spanStyle}>Name</span>
                          {name}
                        </a>
                      </td>
                      <td className={tdStyle}>
                        <span className={spanStyle}>Description</span>
                        {description}
                      </td>
                      <td className={tdStyle}>
                        <span className={spanStyle}>Language</span>
                        {language}
                      </td>
                      <td className={tdStyle}>
                        <span className={spanStyle}>Stars</span>
                        {stargazers_count}
                      </td>
                      <td className={tdStyle}>
                        <span className={spanStyle}>Favourite</span>
                        {isFavourited ? <Heart /> : null}
                      </td>
                      <td className={tdStyle}>
                        <span className="inline-block w-1/3 md:hidden font-bold">
                          Favourite
                        </span>
                        <button
                          disabled={isFavourited}
                          onClick={() => this.addFavourite(id, arr[i])}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 border border-blue-500 rounded"
                        >
                          Add
                        </button>
                        <button
                          disabled={!isFavourited}
                          onClick={() => this.removeFavourite(id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 border border-red-500 rounded"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                }
              )
            : null}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div className="flex h-full justify-center">
        {this.state.fetching ? <Loader /> : this.renderTable()}
      </div>
    );
  }
}

const mapStateToProps = ({ repos }: StoreState): { repos: Repo[] } => ({
  repos,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<StoreState, void, Action>
) => ({
  fetchRepos: () => dispatch(fetchRepos()),
  removeFavourite: (id: number) => dispatch(removeFavourite(id)),
  addFavourite: (id: number, repo: Repo) => dispatch(addFavourite(id, repo)),
});

export const App = connect(mapStateToProps, mapDispatchToProps)(_App);
