// import { Test, TestingModule } from "@nestjs/testing";
import { And, Equal } from "typeorm";
import { mapToTypeormWhere } from "@/infrastructure/http/typeorm-utils";

describe("TypeormUtils", () => {
  // let controller: AuthController;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   controllers: [AuthController],
    //   providers: [AuthService],
    // }).compile();
    //
    // controller = module.get<AuthController>(AuthController);
  });


  it("should be equal", () => {

    const typeormFilter = {
      where: {
        subject: And(Equal("test2")),
        message: And(Equal("test22")),
      },
    };

    const utilsFilters = mapToTypeormWhere([
      {
        _field: "subject",
        _l_op: "and",
        _op: "eq",
        _val: "test2",
      },
      {
        _field: "message",
        _l_op: "and",
        _op: "eq",
        _val: "test22",
      },
    ]);

    const typeormFilterString = JSON.stringify(typeormFilter);

    const utilsFiltersString = JSON.stringify({where: utilsFilters});

    expect(utilsFiltersString).toEqual(typeormFilterString);
  });
});
