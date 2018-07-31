const express = require("express");
const cors = require("cors");
const request = require("request");

const server = express();

server.use(cors({}));

server.get("/api/results/:searchTerm", (req, res) => {
  const encodedSearchTerm = encodeURIComponent(req.params.searchTerm);
  console.log(encodedSearchTerm, decodeURIComponent(encodedSearchTerm));
  request(`https://kotobank.jp/word/${encodedSearchTerm}`, function(
    error,
    response,
    body
  ) {
    if (!error && response.statusCode == 200) {
      // const regex = /デジタル大辞泉<\/a>[^!]*/;
      // const regex = /デジタル大辞泉<\/a>[^!]*![^!]*/im;
      // const regex = /デジタル大辞泉<\/a><span>の解説[^!]+/gimu;
      // const regex = /デジタル大辞泉<\/a>[^!]+<![^!]+<!-- \/\.source -->/gi;

      // this one is to allow the html string to convert directly
      const daijisenRegex = /<h2>[^!]*デジタル大辞泉<\/a>[^!]*<\/div>/;
      const daijirinRegex = /<h2>[^!]*大辞林 第三版<\/a>[^!]*<\/div>/;

      const replaceHeaderRegex = /<h2>[^!]*<\/h2>[^!]*<div class=\"ex cf\">/;

      let daijisenDefinition = body.match(daijisenRegex);
      let daijirinDefinition = body.match(daijirinRegex);

      if (daijisenDefinition) {
        daijisenDefinition = daijisenDefinition[0].replace(
          replaceHeaderRegex,
          "<div id='daijisen' class='definition'><h2>大辞泉</h2>"
        );
      }

      if (daijirinDefinition) {
        daijirinDefinition = daijirinDefinition[0].replace(
          replaceHeaderRegex,
          "<div id='daijirin' class='definition'><h2>大辞林</h2>"
        );
      }

      const match = daijisenDefinition + daijirinDefinition;
      res.status(200).send(match.replace(/\n/g, ""));
    } else {
      console.log("ERROR");
      res.send("ERROR");
    }
  });
});

server.listen(5000, () => {
  console.log("Server listening on port 5000");
});
