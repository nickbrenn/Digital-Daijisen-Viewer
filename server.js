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
      const daijisenRegex = /(?<=\<!-- \/\.dictype 辞書ひとつ --\>)([^\r]*?)デジタル大辞泉\<\/a\>([^\r]*?)(?=\<!-- \/\.dictype 辞書ひとつ --\>)/;
      const daijirinRegex = /(?<=\<!-- \/\.dictype 辞書ひとつ --\>)([^(大辞泉)]*?)大辞林 第三版\<\/a\>([^\r]*?)(?=\<!-- \/\.dictype 辞書ひとつ --\>)/;

      const replaceHeaderRegex = /\<article[^!]*\<h2\>[^!]*\<\/h2\>/;

      const daijisenDefinition = body.match(daijisenRegex);
      const daijirinDefinition = body.match(daijirinRegex);

      let match = "";

      if (daijisenDefinition) {
        match += daijisenDefinition[0].replace(
          replaceHeaderRegex,
          "<article id='daijisen' class='definition'><h2>大辞泉</h2>"
        );
      }

      if (daijirinDefinition) {
        match += daijirinDefinition[0].replace(
          replaceHeaderRegex,
          "<article id='daijirin' class='definition'><h2>大辞林</h2>"
        );
      }

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
