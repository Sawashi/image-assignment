import logo from "./logo.svg";
import "./App.css";
import { Input, Space, Image, Button, Row, Col, notification } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
const { Search } = Input;
function App() {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement) => {
    api.info({
      message: `Notification ${placement}`,
      description:
        "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
      placement,
    });
  };
  const [dataToShow, setDataToShow] = useState([]);
  const [doUserEnteredSearchKey, setDoUserEnteredSearchKey] = useState(0);
  const [stringToSearchMore, setStringToSearchMore] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const handleFetchData = async () => {
    const response = await fetch(
      `https://api.unsplash.com/photos?page=${pageCount}&client_id=pzObb_eHBRNoysOGQ9e1bmJ_z3w_W-p2Q7zEOGGx7m8`
    );
    const data = await response.json();
    setDataToShow(data);
  };
  const handleLoadMore = async () => {
    let newData = "";
    setPageCount(pageCount + 1);
    if (doUserEnteredSearchKey == 0) {
      const response = await fetch(
        `https://api.unsplash.com/photos?page=${pageCount}&client_id=pzObb_eHBRNoysOGQ9e1bmJ_z3w_W-p2Q7zEOGGx7m8`
      );
      newData = await response.json();
    } else {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?page=${pageCount}&query=${stringToSearchMore}&client_id=pzObb_eHBRNoysOGQ9e1bmJ_z3w_W-p2Q7zEOGGx7m8`
      );
      newData = await response.json();
    }
    console.log("New data:");
    console.log(newData);
    setDataToShow(dataToShow.concat(newData.results));
    console.log(dataToShow);
  };
  useEffect(() => {
    handleFetchData();
  }, []);
  function convertToSlug(inputString) {
    return inputString.toLowerCase().replace(/ /g, "-");
  }
  const onSearch = async () => {
    setPageCount(0);
    if (stringToSearchMore && stringToSearchMore !== "") {
      const stringToSearch = convertToSlug(stringToSearchMore);
      setStringToSearchMore(stringToSearch);
      console.log(stringToSearch);
      const response = await fetch(
        `https://api.unsplash.com/search/photos?page=${pageCount}&query=${stringToSearch}&client_id=pzObb_eHBRNoysOGQ9e1bmJ_z3w_W-p2Q7zEOGGx7m8`
      );
      const data = await response.json();
      setDataToShow(data.results);
      setDoUserEnteredSearchKey(1);
    } else {
      const response = await fetch(
        `https://api.unsplash.com/photos?page=${pageCount}&client_id=pzObb_eHBRNoysOGQ9e1bmJ_z3w_W-p2Q7zEOGGx7m8`
      );
      const data = await response.json();
      setDoUserEnteredSearchKey(0);
      setDataToShow(data);
    }
  };
  const setSearchString = (e) => {
    setStringToSearchMore(e.target.value);
  };
  return (
    <div className="App">
      <Search
        placeholder="input search text"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={onSearch}
        onChange={setSearchString}
      />
      <InfiniteScroll
        dataLength={dataToShow.length}
        next={handleLoadMore}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <Space direction="vertical">
          <Row gutter={[16, 16]}>
            {dataToShow.map((image, index) => (
              <Col span={5} key={index}>
                {image ? (
                  <div>
                    <img
                      src={image.urls.raw}
                      alt={`Image ${index + 1}`}
                      style={{
                        width: "90%",
                        height: "90%",
                        objectFit: "cover",
                      }}
                    />
                    <div>{image.slug}</div>
                  </div>
                ) : (
                  <></>
                )}
              </Col>
            ))}
          </Row>
        </Space>
      </InfiniteScroll>
    </div>
  );
}

export default App;
