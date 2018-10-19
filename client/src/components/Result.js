import React from "react";

const Result = props => {
  const html = props.results;
  const downloadCsv = () => {
    // const definitions = document.querySelectorAll(".definition");
    const words = document.getElementsByTagName("h3");
    const definitions = document.querySelectorAll(".description");
    const csvData = new Array(words.length - 1);
    for (let i = 0; i < words.length; i++) {
      csvData[i] = {
        word: words[i].innerHTML,
        definition: definitions[i].innerHTML
      };
    }
    console.log(csvData);
  };
  return (
    <div>
      <button onClick={() => downloadCsv()}>Download CSV Definitions</button>
      <div className="result" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default Result;
