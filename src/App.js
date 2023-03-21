import "./App.css";
import { useEffect, useState } from "react";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debouncedValue;
};

function Page({ type, imageURI, text, title, leftToRight, url }) {
  const [resData, setResData] = useState(null);
  const [error, setError] = useState(null);

  const fetchUrl = async () => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      const str = JSON.stringify(data)
      
      setResData(str.length > 300 ? str.slice(0, 300) + '...' : str);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  useEffect(() => {
    if (type === "data" && url) {
      fetchUrl();
    }
  }, [url, type]);

  const leftToRightStyle = leftToRight ? {flexFlow: 'row-reverse'} : {};
  const imgStyle = text || title || leftToRight != null ? {width: '40%'} : {}

  return (
    <div style={{border: 'solid 1px', width: '90%', margin: '2rem'}}>
      {error ? (
        "Error Json data, check url"
      ) : (
        <div style={{display: 'flex', width: '90%', height: '10rem', ...leftToRightStyle}}>
          {imageURI && <img style={{width:'90%', margin: '1rem', ...imgStyle}} src={imageURI}></img>}
          <div>
            {text != null && <div>{text}</div>}
            {title != null && <div>{title}</div>}
          </div>
          {resData && (<div style={{display: 'flex', margin: '2rem 0'}}>
            <div style={{margin: '0 2rem'}}><button onClick={fetchUrl}>Refresh</button></div>
            <div style={{overflowWrap: 'anywhere'}}>{resData}</div>
          </div>)}
        </div>
      )}
    </div>
  );
}

function Pages({ json }) {
  if (!Array.isArray(json)) {
    return "Expecting an array of objects in json!";
  }
  return (
    <div>
      {json.map((item) => (
        <Page {...item} />
      ))}
    </div>
  );
}

function App() {
  const [text, setText] = useState("");
  const [json, setJson] = useState(false);
  const debouncedText = useDebounce(text, 500);

  useEffect(() => {
    if(debouncedText) {
      let parsed = null;
      try {
        parsed = JSON.parse(debouncedText);
      } catch (e) {
        setJson(null);
        return;
      }
      setJson(parsed);
    }
  }, [debouncedText]);

  const handleJson = (e) => setText(e.target.value);
  return (
    <div style={{display: 'flex', border: 'solid 1px', height: '50rem', margin: '2rem'}}>
      <textarea onChange={handleJson} style={{border: 'solid 1px', margin: '20px', height: '90%', width: '50%'}}/>
      <div style={{border: 'solid 1px', margin: '20px', height: '90%', width: '50%'}}>
        {json ? (
          <Pages json={json} />
        ) : (
          "Invalid Json Data, please update!"
        )}
      </div>
    </div>
  );
}

export default App;
