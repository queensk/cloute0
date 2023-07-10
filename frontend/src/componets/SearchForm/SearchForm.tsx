import { FaSearch } from "react-icons/fa";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./SearchForm.css";

// Define a custom hook to get the current path

interface User {
  Biography: string | null;
  Email: string;
  ProfilePicture: string | null;
  UserID: string;
  Username: string;
  NumberOfFollowers: number;
  NumberOfLikes: number;
}

const usePath = () => {
  const location = useLocation();
  return location.pathname;
};

type SearchFormProps = {};

const SearchForm: React.FC<SearchFormProps> = () => {
  const path = usePath();
  //   const { setMessageUser } = useContext(MessageUserContext);

  const [inputValue, setInputValue] = useState("");

  //   const [results, setResults] = useState<User[]>([]);

  const [showResults, setShowResults] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      resultsRef.current &&
      !resultsRef.current.contains(event.target as Node)
    ) {
      setShowResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setShowResults(true);
  };

  const search = () => {
    // if (inputValue) {
    //   if (path === "/messages" || path === "/") {
    //     const filterParam = {
    //       name: inputValue,
    //     };
    //     api
    //       .post("/user/search", filterParam, {
    //         headers: {
    //           Authorization: `JWT ${state.token}`,
    //         },
    //       })
    //       .then((res) => {
    //         setResults(res.data.data);
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   } else {
    //   }
    // } else {
    //   setResults([]);
    // }
  };

  useEffect(() => {
    search();
  }, [inputValue, path]);

  return (
    <div className="search-form">
      <form>
        <div className="pseudo-search">
          <input
            type="text"
            placeholder="Search..."
            value={inputValue}
            onChange={handleInputChange}
            autoFocus
          />
          <button type="submit">
            <FaSearch />
          </button>
        </div>
      </form>
      <div
        className="search-results"
        ref={resultsRef}
        style={{ display: showResults ? "block" : "none" }}
      >
        {/* {results.length > 0 &&
          results.map((result) => (
            <div
              key={result.UserID}
              className="search-result"
              onClick={() => {
                setMessageUser(result);
                setShowResults(false);
              }}
            >
              {path === "/messages" ||
                (path === "/" && (
                  <>
                    <img
                      src={
                        result.ProfilePicture
                          ? result.ProfilePicture
                          : "https://randomuser.me/api/portraits/men/3.jpg"
                      }
                      alt={result.Username}
                    />
                    <p>{result.Username}</p>
                  </>
                ))}
            </div>
          ))} */}
      </div>
    </div>
  );
};

export default SearchForm;
