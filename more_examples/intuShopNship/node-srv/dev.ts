
// Bus. Layer test
import { Ship } from './lib/Ship';
const yaml = require("js-yaml")
const fs = require("fs-extra")
let config = yaml.load(fs.readFileSync(__dirname + "/config.yaml"));

let ship = new Ship(config.printfulApiID, null) 

ship.ship('pi_00000000000000');