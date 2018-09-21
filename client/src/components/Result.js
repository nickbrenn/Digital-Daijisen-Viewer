import React from "react";

const Result = props => {
  const html = props.results;
  return (
    <div className="result" dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default Result;
