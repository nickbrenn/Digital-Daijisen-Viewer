import React from "react";

const Result = props => {
  const html = props.results;
  return (
    // <div className="result">
    //   HELLO THIS IS RESULTS<br />
    //   <br />
    //   {props.results}
    // </div>

    // the below way will replicate the entire body of response
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default Result;
