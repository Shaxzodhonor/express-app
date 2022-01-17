const fs = require("fs");
const path = require("path");

class FS  {
  constructor(dir){
    this.dir = dir
  }
  read(){
    const data = fs.readFileSync(path.resolve(__dirname, `.${this.dir}`), {encoding: "utf-8", flag: "r"} );
    return JSON.parse(data)
  }

  write(chunk){
    fs.writeFileSync(path.resolve(__dirname, `.${this.dir}`), JSON.stringify(chunk))
  }
}

module.exports = FS;