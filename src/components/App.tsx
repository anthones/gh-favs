import React from "react";
import { connect } from "react-redux";

import { Repo, fetchRepos, Action } from "../actions";
import { StoreState } from "../reducers";
import Loader from "./Loader";
import { ThunkDispatch } from "redux-thunk";
import { TableHead } from "./TableHead";
import { TableRow } from "./TableRow";

interface AppProps {
  repos: Repo[];
  fetchRepos: () => Promise<void>;
}

interface AppState {
  fetching: boolean;
  showFavourites: boolean;
  sorter: keyof Repo | "";
  ascending: boolean;
}

class _App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      fetching: false,
      showFavourites: false,
      sorter: "",
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

  private sortRepos = (): Repo[] => {
    const { sorter } = this.state;

    return sorter
      ? this.props.repos.sort((a: Repo, b: Repo) =>
          this.state.ascending
            ? a[sorter]! < b[sorter]!
              ? -1
              : a[sorter]! > b[sorter]!
              ? 1
              : 0
            : b[sorter]! < a[sorter]!
            ? -1
            : b[sorter]! > a[sorter]!
            ? 1
            : 0
        )
      : this.props.repos;
  };

  private showFavourites = () => {
    this.setState({
      showFavourites: !this.state.showFavourites,
    });
  };

  private sortBy = (sorter: keyof Repo) => {
    this.setState({
      sorter,
      ascending: !this.state.ascending,
    });
  };

  private renderTable = () => (
    <table className="min-w-full border-collapse block md:table">
      <TableHead showFavourites={this.showFavourites} sortBy={this.sortBy} />
      <tbody className="block md:table-row-group">
        {this.sortRepos().reduce(
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
