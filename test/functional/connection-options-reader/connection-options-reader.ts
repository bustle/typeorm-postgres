import {expect} from "chai";
import {ConnectionOptions} from "../../../src/connection/ConnectionOptions";
import {ConnectionOptionsReader} from "../../../src/connection/ConnectionOptionsReader";

describe("ConnectionOptionsReader", () => {
  after(() => {
    delete process.env.TYPEORM_CONNECTION;
    delete process.env.TYPEORM_DATABASE;
  });

  // TODO This test requires the configs/class-entities.json file be moved to the matching directory in build/compiled
  it.skip("properly loads config with entities specified", async () => {
    type EntititesList = Function[] | string[];
    const connectionOptionsReader = new ConnectionOptionsReader({ root: __dirname, configName: "configs/class-entities" });
    const options: ConnectionOptions = await connectionOptionsReader.get("test-conn");
    expect(options.entities).to.be.an.instanceOf(Array);
    const entities: EntititesList = options.entities as EntititesList;
    expect(entities.length).to.equal(1);
  });

  // TODO This test requires the configs/.env file be moved to the matching directory in build/compiled
  it.skip("properly loads config from .env file", async () => {
    const connectionOptionsReader = new ConnectionOptionsReader({ root: __dirname, configName: "configs/.env" });
    const [ fileOptions ]: ConnectionOptions[] = await connectionOptionsReader.all();
    expect(fileOptions.database).to.have.string("test-js");
    expect(process.env.TYPEORM_DATABASE).to.equal("test-js");
  });
});
