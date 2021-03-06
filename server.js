const express = require("express");
const cors = require("cors");
const request = require("request");

const server = express();

server.use(express.json());
server.use(cors({}));

server.get("/", (req, res) => {
  res.json({ Message: "Hello World" });
});

server.get("/api/results/:searchTerm", (req, res) => {
  const encodedSearchTerm = encodeURIComponent(req.params.searchTerm);
  console.log(encodedSearchTerm, decodeURIComponent(encodedSearchTerm));
  request(`https://kotobank.jp/word/${encodedSearchTerm}`, function(
    error,
    response,
    body
  ) {
    if (!error && response.statusCode == 200) {
      // this would get all h2's preceding an ex cf div
      // /<h2>([^\r]*?)<\/h2>(?=[ \n	]*<div class="ex cf">)/g

      // this gets all h3's that come after an ex cf div
      // /(?<=<div class="ex cf">[\n 	]*)<h3>([^\r]*?)<\/h3>/g

      // this one will select everything in an ex cf that has an h3 that includes kanjikoumoku (excluding opening div)
      // /(?<=<div class="ex cf">[\n 	]*)<h3>([^［<]*?)［漢字項目］([^\r]*?)<!-- \/\.ex 解説 -->/g

      // this one is same as above but it'll select the opening div so you can delete the whole thing
      // /<div class="ex cf">[\n 	]*<h3>([^［<]*?)［漢字項目］([^\r]*?)<!-- \/\.ex 解説 -->/g

      // the digital daijisen also uses things like ［列車］［書名］and ［地名］ so make things for those too later
      // daijirin uses a different format

      const daijisenRegex = /デジタル大辞泉<\/a>([^\r]*?)(?=<!-- \/\.dictype 辞書ひとつ -->)/;
      const daijirinRegex = /大辞林 第三版<\/a>([^\r]*?)(?=<!-- \/\.dictype 辞書ひとつ -->)/;

      const replaceHeaderRegex = /[^!]*<\/h2>/;
      const replaceSourceRegex = /<p class=\"source\">([^\r]*?)(<!-- \/\.source -->)/;

      const daijisenDefinition = body.match(daijisenRegex);
      const daijirinDefinition = body.match(daijirinRegex);

      // add settings later to allow the user to decide what to filter out
      const removeKanjiKoumokuRegex = /<div class="ex cf">[\n 	]*<h3>([^［<]*?)［漢字項目］([^\r]*?)<!-- \/\.ex 解説 -->/g;
      const removeNonDefinitions = /<div class="ex cf">[\n 	]*<h3>([^［<]*?)［([^\r]*?)<!-- \/\.ex 解説 -->/g;

      let result = "";

      if (daijisenDefinition) {
        result += daijisenDefinition[0]
          .replace(
            replaceHeaderRegex,
            "<article class='大辞泉 definition'><h2>大辞泉</h2>"
          )
          .replace(replaceSourceRegex, "");
      }

      if (daijirinDefinition) {
        result += daijirinDefinition[0]
          .replace(
            replaceHeaderRegex,
            "<article class='大辞林 definition'><h2>大辞林</h2>"
          )
          .replace(replaceSourceRegex, "");
      }

      if (result === "") {
        res.json({ error: "<div>Empty result</div>" });
      } else {
        result = result.replace(removeNonDefinitions, "");
        res.status(200).json({ result: result.replace(/\n/g, "") });
      }
    } else {
      console.log("SERVER ERROR!");
      if (response) {
        res.json({
          error: "<div>ERROR response status: " + response.statusCode + "</div>"
        });
      } else {
        res.json({ error: "<div>ERROR with no response</div>" });
      }
    }
  });
});

const port = process.env.PORT || 3333;

server.listen(port, err => {
  if (err) console.log(err);
  else {
    console.log(`Listening to port ${port}`);
  }
});
