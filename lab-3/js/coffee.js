class Coffee {
  constructor(size, isDecaf) {
    this.size = size;
    this.isDecaf = isDecaf;
  }

  serveIt() {
    return `Serving a ${this.size} ${this.isDecaf ? "decaf" : "regular"} coffee.`;
  }
}

class Mocha extends Coffee {
  constructor(size, isDecaf, shots, syrup) {
    super(size, isDecaf);
    this.shots = shots;
    this.syrup = syrup;
  }

  describe() {
    return `A ${this.size} Mocha with ${this.shots} shots and ${this.syrup} syrup.`;
  }
}

let mocha1 = new Mocha("large", false, 2, "caramel");
let mocha2 = new Mocha("medium", true, 1, "hazelnut");

const out = document.getElementById("output");

out.innerHTML += mocha1.serveIt() + "<br>";
out.innerHTML += mocha1.describe() + "<br><br>";

out.innerHTML += mocha2.serveIt() + "<br>";
out.innerHTML += mocha2.describe() + "<br>";
