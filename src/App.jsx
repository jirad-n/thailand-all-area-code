import React,{ useState, useEffect } from 'react'
import './App.css'

export default function Projects() {
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  // const [zipcode, setZipcode] = useState([]);
  const [selected, setSelected] = useState({
    province_id: undefined,
    amphure_id: undefined,
    tambon_id: undefined,
    zipcode_id: undefined
  });

  useEffect( () => {
    fetchData();
  },[]);

  const fetchData = async () => {
    try{
      // https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json
      const res = await fetch("/src/Thailanddata.json");
      const body = await res.json();
      setProvinces(body)
    }catch(err){
      console.log(err.message)
    }
  }

  const DropdownList = ({
    label,
    id,
    list,
    child,
    childsId = [],
    setChilds = []
  }) => {
    const onChangeHandle = (event) => {
      setChilds.forEach((setChild) => setChild([]));
      const entries = childsId.map((child) => [child, undefined]);
      const unSelectChilds = Object.fromEntries(entries);

      const input = event.target.value;
      const dependId = input ? Number(input) : undefined;
      setSelected((prev) => ({ ...prev, ...unSelectChilds, [id]: dependId}));

      if (!input) return;

      if (child) {
        console.log(list)
        const parent = list.find((item) => item.id === dependId);
        console.log("parent = ", parent)
        try{
          // setSelected((prev) => ({ ...prev, ...unSelectChilds, zipcode_id: parent }));
          if(parent.zip_code){
            let zipcode = ''+parent.zip_code
            console.log("zipcode= ", zipcode, "typeof= ", typeof(zipcode))
            setSelected((prev) => ({ ...prev, ...unSelectChilds, zipcode_id: parent.zip_code }));
          }
          const { [child]: childs } = parent;
          const [setChild] = setChilds;
          console.log("setChild= ", setChilds)
          setChild(childs);
        }catch(err){
          console.log(err.message)
        }
        
      }
    };

    return (
      <>
        <label htmlFor={label}>{label}</label>
        <select value={selected[id]} onChange={onChangeHandle}>
          <option label="Select ..." />
          {list &&
            list
            .sort(function (a,b){
              if (a.name_th < b.name_th) {
                return -1;
              }
              if (a.name_th > b.name_th) {
                return 1;
              }
              return 0;
            })
            .map((item) => (
              <option
                key={item.id}
                value={item.id}
                label={`${item.name_th} - ${item.name_en}`}
              />
            ))}
        </select>
      </>
    );
  };

  return (
    <div className="App">
      <h1>Thailand area code</h1>
      <DropdownList
        label="Province: "
        id="province_id"
        list={provinces}
        child="amphure"
        childsId={["amphure_id", "tambon_id", "zipcode_id"]}
        setChilds={[setAmphures, setTambons]}
      />
      <br />
      <DropdownList
        label="District: "
        id="amphure_id"
        list={amphures}
        child="tambon"
        childsId={["tambon_id", "zipcode_id"]}
        setChilds={[setTambons]}
      />
      <br />
        <DropdownList label="Tambon: " 
        id="tambon_id" 
        list={tambons} 
        child="tambon" 
        childsId={["zipcode_id"]}
      />
      <br />
      <pre>{JSON.stringify(selected, null, 4)}</pre>
    </div>
  );
}