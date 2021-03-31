import { AutoComplete, Input } from "antd";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

//render title for search box
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

//render item for search box
const renderItem = (id, title, count, category) => ({
  value: id,
  label: (
    <Link to={{ pathname: `/${category}/${id}` }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {title}
        <span>{count}</span>
      </div>
    </Link>
  ),
});

const handleSearch = (value, spotify, setOptions, setData, emptyDataState) => {
  if (value) {
    spotify.search(value, ["track", "album", "artist"]).then(
      function (result) {
        if (!result) {
          setOptions([]);
          if (setData) {
            setData(emptyDataState);
          }
        }
        
        const data = {}
        for (const category of Object.keys(result)) {
          data[category] = result[category].items.filter((val)=>val!=null)
        }
       
        const options = Object.keys(data).map((category) => {
          const options = data[category].slice(0, 2).map((item) => {
            return renderItem(
              item.id,
              item.name,
              item.artists ? item.artists[0].name : "",
              category.slice(0, -1)
            );
          });

          return { label: renderTitle(category), options: options };
        });
        setOptions(options);
        if (setData) {
          for (const category of Object.keys(data)) {
            setData((prev) => {
              return { ...prev, [category]: data[category] };
            });
          }
        }
      },
      function (err) {
        console.error("err", err);
      }
    );
  } else {
    setOptions([]);
    if (setData) {
      setData(emptyDataState);
    }
  }
};

function SearchFunction({ spotify, setData, emptyDataState, size,defaultSearchTerm }) {
  const [options, setOptions] = useState();
  const [searchTerm,setSearchTerm] = useState(defaultSearchTerm ? defaultSearchTerm : "");
  const history = useHistory();

  const onSelect = (value) => {
    console.log("onSelect", value);
  };

  const onSearch = (term) => {
    history.push({ pathname: "/",state: { searchTerm: term } });
    console.log("term", term);
  };

  useEffect(()=>{
    if(defaultSearchTerm){
        handleSearch(defaultSearchTerm, spotify, setOptions, setData, emptyDataState)
      }
    },[])
  

  return (
    <AutoComplete
      value={searchTerm}  
      dropdownMatchSelectWidth={true}
      style={{
        width: size,
      }}
      onChange={setSearchTerm}
      options={options}
      onSelect={onSelect}
      onSearch={(value) =>
        handleSearch(value, spotify, setOptions, setData, emptyDataState)
      }
    >
      <Input.Search
        size="large"
        placeholder="Search here"
        enterButton
        onSearch={onSearch}
      />
    </AutoComplete>
  );
}

export default SearchFunction;
