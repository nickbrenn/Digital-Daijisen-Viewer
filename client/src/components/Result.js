import React from "react";
import { Button } from "reactstrap";

const Result = props => {
  const html = props.results;
  const downloadCsv = () => {
    const definitions = document.querySelectorAll(".description");
    if (!(definitions.length > 0)) {
      return;
    }
    const words = document.getElementsByTagName("h3");
    const csvData = new Array(words.length - 1);
    for (let i = 0; i < words.length; i++) {
      let pronunciation = "";
      let word = "";
      if (words[i].innerText.includes("【")) {
        pronunciation = words[i].innerText.match(/([^\r]*?)(?=【)/)[0];
        word = words[i].innerText.match(/([^【]*?)(?=】)/)[0];
      } else {
        pronunciation = words[i].innerText;
        word = pronunciation;
      }
      // Remove kanji demarcations
      pronunciation = pronunciation.replace(/[‐・]/, "");
      csvData[i] = [
        word,
        pronunciation,
        definitions[i].innerHTML,
        words[i].parentNode.parentNode.classList[0]
      ];
    }
    const BOM = "\uFEFF";
    const csvString =
      "word,pronunciation,definition,dictionary\n" + csvData.join("\n");
    const download = document.createElement("a");
    download.href = "data:text/csv;charset=utf-8," + encodeURI(BOM + csvString);
    download.target = "_blank";
    download.download = "ddv.csv";
    download.click();
  };
  return (
    <div>
      <div className="download-button">
        <Button
          color="primary"
          className="secondary-btn"
          onClick={event => {
            event.target.blur();
            downloadCsv();
          }}
        >
          Download CSV Definitions
        </Button>
      </div>
      <div className="result" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default Result;
