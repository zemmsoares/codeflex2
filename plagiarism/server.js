const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var _ = require("lodash");
app.use(express.json());

const cors = require("cors");

const { exec } = require("child_process");

// Filesystem module
var fs = require("fs");
var dir = "./tmp";
var resultado = [];

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/data", function (req, res) {
  var array = [];
  var array2 = [];
  var array3 = [];
  var i;
  // remove directory and files if exists
  fs.rmSync(dir, { recursive: true, force: true });
  // create directory
  fs.mkdirSync(dir);

  //filter post data
  Object.keys(req.body).map((key, index) => {
    req.body[key].map(
      (submission) => {
        //create directory for each user
        if (!fs.existsSync(dir + "/" + submission.users.username)) {
          fs.mkdirSync(dir + "/" + submission.users.username, {
            recursive: true,
          });
        }

        //create directory for problem in each user
        if (
          !fs.existsSync(
            dir + "/" + submission.users.username + "/" + submission.problem.id
          )
        ) {
          fs.mkdirSync(
            dir + "/" + submission.users.username + "/" + submission.problem.id,
            {
              recursive: true,
            }
          );
        }

        // decode base64 code
        var base64 = submission.code;
        var decoded = Buffer.from(base64, "base64");

        //create submissions
        fs.writeFile(
          dir +
            "/" +
            submission.users.username +
            "/" +
            submission.problem.id +
            "/" +
            submission.id +
            ".pl",
          decoded,
          function (err, data) {
            if (err) {
              return console.log(err);
            }
            //console.log(data);
          }
        );

        //array object with submissions and exec_paths
        let item = {
          problem: submission.problem.id,
          user: submission.users.username,
          language: submission.language.mode,
          exec_path:
            dir +
            "/" +
            submission.users.username +
            "/" +
            submission.problem.id +
            "/" +
            submission.id +
            ".pl",
          date: submission.date,
        };

        array.push(item);
      }

      //console.log(submission.users.username)
    );
  });

  array2 = _.groupBy(array, "problem");
  //console.log(array2);

  // Build new object with exec path for each problem
  let result = "";
  for (let properties in array2) {
    //console.log(properties);
    for (let i = 0; i < array2[properties].length; i++) {
      result = result.concat(" " + array2[properties][i].exec_path);
    }
    let item2 = {
      problem: properties,
      exec_path: result,
    };
    array3.push(item2);
    result = "";
  }
  console.log(array3);

  make_tests(array3);
});

// sleep time expects milliseconds
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function make_tests(array3) {
  sleep(500).then(() => {
    // Do something after the sleep!
    for (let problems in array3) {
      //console.log(array3[problems].exec_path);
      exec(
        "./sim_prol -p " + array3[problems].exec_path,
        (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          //console.log("./sim_prol -p " + array3[problems].exec_path);
          //stddout
          //console.log("Problem " + array3[problems].problem + ":");
          console.log(`${stdout}`);

          let stdoutR = {
            problem: array3[problems].problem,
            stdout: `${stdout}`,
          };
          resultado.push(stdoutR);
        }
      );
    }
  });
}

app.get("/test", function routeHandler(req, res) {
  res.send(resultado);
});

app.listen(8082, function () {
  //console.log("Server started on port 3001");
});
