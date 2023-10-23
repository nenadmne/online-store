import React, { useContext, useEffect} from "react";
import "./SearchItem.css";
import useInput from "../../../UI/useInput";
import ProductContext from "../../../Store/context";
import InputField from "../../../UI/InputField";

const SearchItem = () => {
  const prodCtx = useContext(ProductContext);
  const { enteredValue: enteredSearch, onChangeHandler: changeSearchHandler } =
    useInput((enteredSearch) => enteredSearch.trim().length > 0);
  const submitHandler = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    prodCtx.searchItem(enteredSearch.toLowerCase());
  }, [enteredSearch]);

  return (
    <div className="input-div">
      <form onSubmit={submitHandler}>
        <InputField
          placeholder="Search..."
          name="search"
          type="text"
          onChange={changeSearchHandler}
          value={enteredSearch}
        />
      </form>
    </div>
  );
};

export default SearchItem;
