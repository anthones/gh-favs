import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { Action, addFavourite, removeFavourite, Repo } from "../actions";
import { StoreState } from "../reducers";
import { Heart } from "./Heart";

interface TableRowProps {
  repo: Repo;
  index: number;
  addFavourite: (repoId: number, repo: Repo) => Promise<void>;
  removeFavourite: (repoId: number) => Promise<void>;
}

const tdStyle =
  "p-2 md:border md:border-grey-500 text-left block md:table-cell";
const spanStyle = "inline-block w-1/3 md:hidden font-bold";

export const _TableRow = ({
  repo,
  index: i,
  addFavourite,
  removeFavourite,
}: TableRowProps) => {
  const {
    id,
    name,
    html_url,
    language,
    description,
    isFavourited,
    stargazers_count,
  } = repo;

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
          onClick={() => addFavourite(id, repo)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 border border-blue-500 rounded"
        >
          Add
        </button>
        <button
          disabled={!isFavourited}
          onClick={() => removeFavourite(id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 border border-red-500 rounded"
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<StoreState, void, Action>
) => ({
  removeFavourite: (id: number) => dispatch(removeFavourite(id)),
  addFavourite: (id: number, repo: Repo) => dispatch(addFavourite(id, repo)),
});

export const TableRow = connect(null, mapDispatchToProps)(_TableRow);
