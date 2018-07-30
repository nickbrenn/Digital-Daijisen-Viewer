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
      const regex = /デジタル大辞泉<\/a>[^!]*/;
      // const regex = /デジタル大辞泉<\/a>[^!]*![^!]*/im;
      // const regex = /デジタル大辞泉<\/a><span>の解説[^!]+/gimu;
      // const regex = /デジタル大辞泉<\/a>[^!]+<![^!]+<!-- \/\.source -->/gi;
      const match = body.match(regex);
      res.status(200).send(match);
      // res.status(response.statusCode).send(body);
      // console.log(body); // Print the web page.
    } else {
      console.log("ERROR");
      res.send("ERROR");
    }
  });
});

server.listen(5000, () => {
  console.log("Server listening on port 5000");
});
