interface TableHeadProps {
  sortBy: (sorter: string) => void;
  showFavourites: () => void;
}

const thStyle =
  "bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell";

export const TableHead = ({ sortBy, showFavourites }: TableHeadProps) => (
  <thead className="block md:table-header-group">
    <tr className="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto  md:relative ">
      <th
        className={thStyle}
        onClick={() => {
          sortBy("name");
        }}
      >
        Name
      </th>
      <th className={thStyle}>Description</th>
      <th
        className={thStyle}
        onClick={() => {
          sortBy("language");
        }}
      >
        Language
      </th>
      <th className={thStyle}>Stars</th>
      <th className={thStyle}>
        Favourite{" "}
        <button
          onClick={showFavourites}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 border border-yellow-500 rounded"
        >
          Toggle Favourites
        </button>
      </th>
      <th className={thStyle}>Actions</th>
    </tr>
  </thead>
);
