import { FaSearch } from "react-icons/fa";
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./SearchForm.css";
import {
  useSearchUserQuery,
  useUseMessageUserMutation,
} from "../../features/auth/authApi";
import { MdChat } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { setMessage } from "../../features/chatSlice/chatSlice";

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
  const [messageUser] = useUseMessageUserMutation();
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.user.id);
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
  console.log(results);

  const { data, isSuccess, isLoading } = useSearchUserQuery({
    userName: inputValue,
  });
  const handleClickSearch = async (receiverId) => {
    const userRoom = await messageUser({
      senderId: userId,
      receiverId: receiverId,
    });
    dispatch(
      setMessage({
        senderId: userId,
        receiverId: receiverId,
        roomId: userRoom.data.data[0].id,
      })
    );
    setShowResults(false);
  };

  useEffect(() => {
    if (isSuccess && data) {
      // update the results state with the data
      setResults(data.data);
    }
  }, [isSuccess, data]);

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
        {results.length > 0 &&
          results.map((result) => (
            <div
              key={result.id}
              className="search-result"
              onClick={() => handleClickSearch(result.id)}
            >
              <div className="search-result-info">
                <img
                  src={
                    result.profilePic
                      ? result.profilePic
                      : "https://randomuser.me/api/portraits/men/3.jpg"
                  }
                  alt={result.name}
                />
                <p>{result.userName}</p>
              </div>
              <div className="search-result-message">
                <span className="user-search-btn">
                  <MdChat />
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SearchForm;
