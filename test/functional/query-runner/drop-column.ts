import "reflect-metadata";
import {expect} from "chai";
import {Connection} from "../../../src/connection/Connection";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";

describe("query runner > drop column", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    after(() => closeTestingConnections(connections));

    it("should correctly drop column and revert drop", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        let table = await queryRunner.getTable("post");
        const idColumn = table!.findColumnByName("id")!;
        const nameColumn = table!.findColumnByName("name")!;
        const versionColumn = table!.findColumnByName("version")!;
        idColumn!.should.be.exist;
        nameColumn!.should.be.exist;
        versionColumn!.should.be.exist;

        // better-sqlite3 seems not able to create a check constraint on a non-existing column
        if (connection.name === "better-sqlite3") {
            await queryRunner.dropCheckConstraints(table!, table!.checks);
        }

        await queryRunner.dropColumns(table!, [idColumn, nameColumn, versionColumn]);

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("name")).to.be.undefined;
        expect(table!.findColumnByName("version")).to.be.undefined;
        expect(table!.findColumnByName("id")).to.be.undefined;

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        table!.findColumnByName("id")!.should.be.exist;
        table!.findColumnByName("name")!.should.be.exist;
        table!.findColumnByName("version")!.should.be.exist;

        await queryRunner.release();
    })));

});
