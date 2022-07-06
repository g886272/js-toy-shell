const body = document.getElementsByTagName("body")[0];
let inputBox = document.getElementsByClassName("in")[0];
const content = document.getElementsByTagName("main")[0];
const files = { "about.txt": ["26 year old sysadmin", "born and raised in the deepest and darkest depths of the bavarian jungle", "now living and working in berlin", "into cloud shit, x86 re/malware analysis and web development"], "experience.txt": ["3 years of it specialist apprenticeship", "have mainly done classic sysadmin work after that, i.e. administrated linux and windows servers, wrote countless scripts in python/bash/powershell/exotic proprietary languages, done user support", "sometimes i also enjoy software development. i've dabbled in numerous languages, though i'm not particularly good at any of them. these inlude but are not limited to python, javascript, ruby, java and c, with [0] being the one i am most familiar with"] }
const urls = { "github": "https://github.com/km80/", "linkedin": "https://www.linkedin.com/in/kevin-mai-324b86171/" }
const commands = ["ls", "cat", "pwd", "motd", "history", "help", "github", "linkedin", "clear"];
let history = []

body.addEventListener("keydown", (k) => {
  if (k.code == "Backspace") {
    inputBox.textContent = inputBox.textContent.slice(0,-1);
  } else if (k.code == "Enter") {
    addToHistory(inputBox.textContent);
    evalInput(inputBox.textContent);
  } else if (k.code == "Tab") {
    k.preventDefault();
    autoComplete(inputBox.textContent);
  } else {
    inputBox.textContent = inputBox.textContent + k.key;
  }
});

function evalInput(input) {
  if (input != "") {  
    const w = input.split(" ");
    const n = w.length;
    const cmd = w[0]

    if (cmd == "clear") {
      content.innerHTML = "";

      createNewInputField();
      setInputField(0);
    } else {
      if (cmd == "ls") {
        listContents();
      } else if (cmd == "cat") {
        const arg = w[1];

        if (arg == null) {
          printArgError();
        } else {
          renderFile(arg);
        }
      } else if (cmd == "pwd") {
        printWorkingDir();
      } else if (cmd == "motd") {
        printMessageOfTheDay();
      } else if (cmd == "github") {
        window.open(urls["github"],"_blank");
      } else if (cmd == "linkedin") {
        window.open(urls["linkedin"],"_blank");
      } else if (cmd == "history") {
        const arg = w[1];

        if (arg  != null) {
          if (arg == "-c") {
            clearHistory();
	  }
        } else {
          showHistory();
        }
      } else if (cmd == "help") {
        printHelp();
      } else {
        printNotFound();
      }
      createNewInputField();
      setInputField(document.getElementsByClassName("in").length - 1);
    }
  }
}

// bit clunky when multiple commands or files fit the bill
// will fix this some day i.e. never
function autoComplete(i) {
  if (i != "") {
    buf = i.split(" ");
    if (buf[1] != null) {
      if (buf[0] == "cat" && buf[1] != "") {
        const keys = Object.keys(files);
        keys.forEach((k) => {
          let substrLen = buf[1].length;
          if (buf[1] == k.substr(0, substrLen)) {
            inputBox.textContent = inputBox.textContent + k.substr(substrLen, k.length - 1);
          }
        });
      } else {
        listContents();
        createNewInputField();
        setInputField(document.getElementsByClassName("in").length - 1);
        inputBox.textContent = buf[0] + " ";
      }
    } else {
      for (let i = 0; i < commands.length; i++) {
        let substrLen = buf[0].length;

        if (buf[0] == commands[i].substr(0, substrLen)) {
          inputBox.textContent = inputBox.textContent + commands[i].substr(substrLen, commands[i].length - 1);
        }
      }
    }
  }
}

function addToHistory(cmd) {
  if (history.length == 5) {
    history.shift();
  }

  history.push(cmd);
}

function showHistory() {
  const resultDiv = document.createElement("div");
  const histSize = history.length
  let count = 1;
  history.forEach((c) => {
    let tmp = document.createElement("span");
    tmp.classList.add("blocka");
    tmp.appendChild(document.createTextNode(count + " " + c));
    resultDiv.appendChild(tmp);
    content.appendChild(resultDiv);
    count++;
  });
}

function clearHistory() {
  history = [];
}

function printWho() {
  const resultDiv = document.createElement("div");
  resultDiv.textContent = "good question. who are we but dust in the wind";
  content.appendChild(resultDiv);
}

function printArgError() {
  const resultDiv = document.createElement("div");
  resultDiv.textContent = "need argument, try 'ls' for available objects";
  content.appendChild(resultDiv);
}

function printHelp() {
  const resultDiv = document.createElement("div");
  resultDiv.textContent = "available commands: " + commands.join(" ");
  content.appendChild(resultDiv);
}

function printNotFound() {
  const resultDiv = document.createElement("div");
  resultDiv.textContent = "command not found, try 'help' for available commands";
  content.appendChild(resultDiv);
}

function printMessageOfTheDay() {
  const notes = ["welcome. this thing here functions a bit like a primitive shell and contains more information on me and what i do", "the development process was fueled by a desire to delve back into the little javascript i remember and do something interesting with it", "since the code is pretty messy and violates many if not all clean code principles, it's primarily being kept alive for archiving purposes", "use 'help' for a list of commands. ghetto tab completion is active"]
  const resultDiv = document.createElement("div");
  for (let i = 0; i < notes.length; i++) {
    let tmp = document.createElement("p");
    tmp.appendChild(document.createTextNode(notes[i]));
    resultDiv.appendChild(tmp);
  }
  content.appendChild(resultDiv);
}

function printWorkingDir() {
  const resultDiv = document.createElement("div");
  resultDiv.textContent = "http://kmai.xyz/";
  content.appendChild(resultDiv);
}

function listContents() {
  const resultDiv = document.createElement("div");
  const keys = Object.keys(files);
  resultDiv.textContent = keys.join(" ");
  content.appendChild(resultDiv);
}

function renderFile(f) {
  const resultDiv = content.appendChild(document.createElement("div"));

  for (const [k, v] of Object.entries(files)) {
    if (k == f) {
      v.forEach((v) => {
        let pNode = document.createElement("p");
        pNode.appendChild(document.createTextNode(v));
        resultDiv.appendChild(pNode)
      });
    }
  }
}

function createNewInputField() {
  const newDiv = document.createElement("div");
  newDiv.textContent = "> ";
  const newIn = document.createElement("span");
  newIn.textContent = "";
  newIn.classList.add("in");
  newDiv.appendChild(newIn);
  content.appendChild(newDiv);
}

function setInputField(n) {
  inputBox = document.getElementsByClassName("in")[n];
}
