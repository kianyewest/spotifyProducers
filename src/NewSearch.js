import React from "react";
import { useState } from "react";
import {
  Layout,
  Menu,
  Breadcrumb,
  Row,
  Col,
  Space,
  Select,
  Input,
  AutoComplete,
  List,
  Avatar,
} from "antd";

const { Header, Content, Footer } = Layout;
const { Option } = Select;
const { Search } = Input;

const renderTitle = (title) => (
  <span>
    {title}
    <div
      style={{
        float: "right",
      }}
    >
      View All
    </div>
  </span>
);

const renderItem = (id, title, count) => ({
  value: id,
  label: (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {title}
      <span>{count}</span>
    </div>
  ),
});

const doSearch = (spotify, searchTypes, query, callback) => {
  console.log("query called: ", query);
  query &&
    spotify.search(query, searchTypes).then(
      function (newData) {
        console.log("new Data: ", query, newData);
        // if (newData.hasOwnProperty("albums")) {
        //   console.log(typeof newData.albums.items);

        //   newData.albums.items.sort((a, b) => {
        //     if (a.album_type === b.album_type) {
        //       return 0;
        //     } else if (a.album_type === "album") {
        //       return -1;
        //     }
        //     return 1;
        //   });
        // }
        callback(newData);
      },
      function (err) {
        console.error("err", err);
      }
    );
};

const Complete = ({ handleSearch, options }) => {
  const onSelect = (value) => {
    console.log("onSelect", value);
  };

  const onSearch = (term) => {
    console.log("term", term);
  };

  console.log("big options: ", options);

  return (
    <AutoComplete
      dropdownMatchSelectWidth={true}
      style={{
        width: 700,
      }}
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
    >
      <Input.Search
        size="large"
        placeholder="input here"
        enterButton
        onSearch={onSearch}
      />
    </AutoComplete>
  );
};

const SearchInput = ({ placeholder, style, spotify, searchTypes }) => {
  const [data, setData] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value) => {
    console.log("value: ", value);
    console.log("searchValue :", searchTerm);
    if (value) {
      console.log("getting :", searchTerm);
      doSearch(spotify, searchTypes, value, (data) => setData(data));
    } else {
      setData([]);
    }
  };

  const handleChange = (value) => {
    console.log("value in change is: ", value);
    setSearchTerm(value);
  };

  const options =
    data &&
    data.hasOwnProperty("tracks") &&
    data.tracks.items.map((d) => <Option key={d.id}>{d.name}</Option>);
  return (
    <>
      <Search
        placeholder="input search text"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={handleSearch}
      />
      <Select
        showSearch
        enterButton="Search"
        value={searchTerm}
        placeholder={"input here"}
        style={{ width: 200 }}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
      >
        <Input.Search size="large" placeholder="input here" enterButton />
        {options}
      </Select>
    </>
  );
};

// const { Header, Footer, Sider, Content } = Layout;
function NewSearch({ spotify }) {
  const [{tracks,albums,artists}, setData] = useState({tracks:[],albums:[],artists:[]});
  const [options, setOptions] = useState();

  const handleSearch = (value) => {
    if (value) {
      doSearch(spotify, ["track", "album", "artist"], value, (data) => {
        if (!data) {
          setOptions([]);
          setData([]);
        }
        //   setData(data)
        // setData(data);
        //handle data formatting for search bar
        const options = Object.keys(data).map((category) => {
          const options = data[category].items.slice(0, 2).map((item) => {
            return renderItem(
              item.id,
              item.name,
              item.artists ? item.artists[0].name : ""
            );
          });
          console.log("rendering: ", category, options);
          return { label: renderTitle(category), options: options };
        });
        setOptions(options);
        
        for (const category of Object.keys(data)) {
            setData((prev)=> {return {...prev,[category]:data[category].items.slice(0,3)}})  

          }

        // const displayData = Object.keys(data).map((category) => {
        //   const options = data[category].items.slice(0, 2).map((item) => {
        //     return { title: item.name };
        //   });
        //   console.log("dis: ",options)

        //   return options;
        // });
        // console.log("displayData", displayData);
        // setData(displayData);
      });
    }
  };

  console.log("spot: ", spotify);
  return (
    <>
      <Layout className="layout">
        <Content>
          <Row>
            <Col span={24}>
              <div className="jumbotron" align="center">
                <Complete
                  spotify={spotify}
                  options={options}
                  handleSearch={handleSearch}
                />
              </div>
            </Col>
          </Row>
          <Row>
          <Col span={8}>
                <List
                  itemLayout="horizontal"
                  dataSource={tracks}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                            <Avatar shape="square" size={64} src={item.album.images[0].url}  />
                        }
                        title={<a href="https://ant.design">{item.name}</a>}
                        description={item.artists[0].name}
                      />
                      {console.log("track,", item)}
                    </List.Item>
                  )}
                />
              </Col>
              <Col span={8}>
                <List
                  itemLayout="horizontal"
                  dataSource={albums}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                            <Avatar shape="square" size={64} src={item.images[0].url}  />
                        }
                        title={<a href="https://ant.design">{item.name}</a>}
                        description={item.artists[0].name}
                      />
                
                    </List.Item>
                  )}
                />
              </Col>
              <Col span={8}>
                <List
                  itemLayout="horizontal"
                  dataSource={artists}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                            <Avatar shape="square" size={64} src={item.images[0].url}  />
                        }
                        title={<a href="https://ant.design">{item.name}</a>}
                      />
               
                    </List.Item>
                  )}
                />
              </Col>

            
          </Row>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </>
  );
}

export default NewSearch;
