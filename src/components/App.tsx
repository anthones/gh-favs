import React from "react";
import { connect } from "react-redux";

import { Repo, fetchRepos, Action } from "../actions";
import { StoreState } from "../reducers";
import Loader from "./Loader";
import { ThunkDispatch } from "redux-thunk";
import { TableHead } from "./TableHead";
import { TableRow } from "./TableRow";
import "./App.css";

interface AppProps {
  repos: Repo[];
  fetchRepos: () => Promise<void>;
}

interface AppState {
  fetching: boolean;
  showFavourites: boolean;
  sortBy: string;
  ascending: boolean;
}

class _App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      fetching: false,
      showFavourites: false,
      sortBy: "",
      ascending: false,
    };
  }

  componentDidUpdate(prevProps: AppProps): void {
    if (!prevProps.repos.length && this.props.repos.length) {
      this.setState({
        fetching: false,
      });
    }
  }

  componentDidMount(): void {
    this.props.fetchRepos();
    this.setState({ fetching: true });
  }

  private getRepos = (): Repo[] => {
    const { sortBy } = this.state;
    const localRepos = JSON.parse(localStorage.getItem("favourites")!) || [];
    const ids = new Set(localRepos.map(({ id }: Repo) => id));
    const unsorted = this.props.repos.length
      ? [
          ...localRepos,
          ...this.props.repos.filter(({ id }: Repo) => ids && !ids.has(id)),
        ]
      : [];

    return sortBy
      ? unsorted.sort((a, b) =>
          this.state.ascending
            ? a[sortBy] < b[sortBy]
              ? -1
              : a[sortBy] > b[sortBy]
              ? 1
              : 0
            : b[sortBy] < a[sortBy]
            ? -1
            : b[sortBy] > a[sortBy]
            ? 1
            : 0
        )
      : unsorted;
  };

  private showFavourites = () => {
    this.setState({
      showFavourites: !this.state.showFavourites,
    });
  };

  private sortBy = (sorter: string) => {
    this.setState({
      sortBy: sorter,
      ascending: !this.state.ascending,
    });
  };

  private renderTable = () => (
    <table className="min-w-full border-collapse block md:table">
      <TableHead showFavourites={this.showFavourites} sortBy={this.sortBy} />
      <tbody className="block md:table-row-group">
        {this.getRepos().reduce(
          (rows: JSX.Element[], repo: Repo, i) =>
            this.state.showFavourites
              ? [
                  ...rows,
                  ...(repo.isFavourited
                    ? [<TableRow repo={repo} key={i} />]
                    : []),
                ]
              : [...rows, <TableRow repo={repo} key={i} />],
          []
        )}
      </tbody>
    </table>
  );

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
});

export const App = connect(mapStateToProps, mapDispatchToProps)(_App);
