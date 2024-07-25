/* eslint-disable no-undef */
const {
  inflect,
  camelize,
  pluralize,
  singularize,
  dasherize,
  underscore,
  humanize,
  capitalize,
  titleize,
  tableize,
  classify,
  // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
} = require("inflection");

module.exports = function(plop) {
  plop.setHelper("upperCase", (text) => text.toUpperCase());
  plop.setHelper("lowerCase", (text) => text.toLowerCase());
  plop.setHelper("camelCase", (text) =>
    camelize(text.replaceAll("-", "_"), true),
  );
  plop.setHelper("plural", (text) => pluralize(text.replaceAll("-", "_")));
  plop.setHelper("singular", (text) => singularize(text.replaceAll("-", "_")));
  plop.setHelper("upperCaseFirst", (text) =>
    camelize(text.replaceAll("-", "_"), true),
  );
  plop.setHelper("lowerCaseFirst", (text) =>
    camelize(text.replaceAll("-", "_"), false),
  );
  plop.setHelper("dasherize", (text) => dasherize(text.replaceAll("-", "_")));
  plop.setHelper("dasherizeSingular", (text) =>
    singularize(dasherize(text.replaceAll("-", "_"))),
  );
  plop.setHelper("underscore", (text) => underscore(text.replaceAll("-", "_")));
  plop.setHelper("humanize", (text) => humanize(text.replaceAll("-", "_")));
  plop.setHelper("capitalize", (text) => capitalize(text.replaceAll("-", "_")));
  plop.setHelper("titleize", (text) => titleize(text.replaceAll("-", "_")));
  plop.setHelper("tableize", (text) => tableize(text.replaceAll("-", "_")));
  plop.setHelper("classify", (text) => classify(text.replaceAll("-", "_")));
  plop.setHelper("exceptionnify", (text) =>
    text.replaceAll("-", "_").toUpperCase(),
  );

  const groupPrompts = [
    {
      type: "input",
      name: "name",
      message: "entity name",
    },
    {
      type: "input",
      name: "group",
      message: "group name",
    },
  ];

  const patternPrompts = [
    ...groupPrompts,
    {
      type: "input",
      name: "pattern",
      message: "pattern name",
    },
  ];

  const generateModel = [
    {
      type: "add",
      path: "src/core/domain/{{dasherize group}}/{{dasherize name}}.model.ts",
      templateFile: "plop-templates/core/domain/base/base.model.hbs",
    },
  ];

  const generateInterface = [
    {
      type: "add",
      path: "src/core/domain/{{dasherize group}}/i-{{dasherize name}}.ts",
      templateFile: "plop-templates/core/domain/base/i-base.hbs",
    },
  ];

  const generateEnum = [
    {
      type: "add",
      path: "src/core/domain/{{dasherize group}}/{{dasherize name}}.enum.ts",
      templateFile: "plop-templates/core/domain/base/base.enum.hbs",
    },
  ];

  const generateRepositoryPort = [
    {
      type: "add",
      path: "src/core/domain/{{dasherize group}}/i-{{dasherize name}}.repository.ts",
      templateFile:
        "plop-templates/core/domain/base/i-base.repository.hbs",
    },
  ];

  const generateServicePort = [
    {
      type: "add",
      path: "src/core/domain/{{dasherize group}}/i-{{dasherize name}}.service.ts",
      templateFile:
        "plop-templates/core/domain/base/i-base.service.hbs",
    },
  ];

  const generateRepository = [
    {
      type: "add",
      path: "src/infrastructure/features/{{dasherize group}}/{{dasherize name}}.repository.ts",
      templateFile:
        "plop-templates/infrastructure/features/base/base.repository.hbs",
    },
  ];

  const generateService = [
    {
      type: "add",
      path: "src/infrastructure/features/{{dasherize group}}/{{dasherize name}}.service.ts",
      templateFile:
        "plop-templates/infrastructure/features/base/base.service.hbs",
    },
  ];

  const generateEntity = [
    {
      type: "add",
      path: "src/infrastructure/features/{{dasherize group}}/{{dasherize name}}.entity.ts",
      templateFile:
        "plop-templates/infrastructure/features/base/base.entity.hbs",
    },
  ];

  const generateDomainExporter = [
    {
      type: "add",
      path: "src/domain/{{dasherize group}}/index.ts",
      templateFile:
        "plop-templates/domain/base/index.hbs",
    },
  ];

  const generateInfraExporter = [
    {
      type: "add",
      path: "src/infrastructure/features/{{dasherize group}}/index.ts",
      templateFile:
        "plop-templates/infrastructure/features/base/index.hbs",
    },
    {
      type: "add",
      path: "src/infrastructure/features/{{dasherize group}}/dtos/index.ts",
      templateFile:
        "plop-templates/infrastructure/features/base/dtos/index.hbs",
    },
    {
      type: "add",
      path: "src/infrastructure/features/{{dasherize group}}/{{dasherize name}}.module.ts",
      templateFile:
        "plop-templates/infrastructure/features/base/base.module.hbs",
    },

  ];

  const generateController = [
    {
      type: "add",
      path: "src/infrastructure/features/{{dasherize group}}/{{dasherize name}}.controller.ts",
      templateFile:
        "plop-templates/infrastructure/features/base/base.controller.hbs",
    },
  ];

  const generateCommand = [
    {
      type: "add",
      path: "src/core/application/features/{{dasherize group}}/{{dasherize name}}.command.ts",
      templateFile:
        "plop-templates/core/application/features/base/base.command.hbs",
    },
    {
      type: "add",
      path: "src/core/application/features/{{dasherize group}}/{{dasherize name}}-command.handler.ts",
      templateFile:
        "plop-templates/core/application/features/base/base-command.handler.hbs",
    },
    {
      type: "add",
      path: "src/core/application/features/{{dasherize group}}/{{dasherize name}}-command.response.ts",
      templateFile:
        "plop-templates/core/application/features/base/base-command.response.hbs",
    },
  ];

  const generateQuery = [
    {
      type: "add",
      path: "src/core/application/features/{{dasherize group}}/{{dasherize name}}.query.ts",
      templateFile:
        "plop-templates/core/application/features/base/base.query.hbs",
    },
    {
      type: "add",
      path: "src/core/application/features/{{dasherize group}}/{{dasherize name}}-query.handler.ts",
      templateFile:
        "plop-templates/core/application/features/base/base-query.handler.hbs",
    },
    {
      type: "add",
      path: "src/core/application/features/{{dasherize group}}/{{dasherize name}}-query.response.ts",
      templateFile:
        "plop-templates/core/application/features/base/base-query.response.hbs",
    },
  ];

  const generateException = [
    {
      type: "add",
      path: "src/core/domain/{{dasherize group}}/{{dasherize name}}.exception.ts",
      templateFile: "plop-templates/core/domain/base/base.exception.hbs",
    },
  ];

  const generateDto = [
    {
      type: "add",
      path: "src/infrastructure/features/{{dasherize group}}/dtos/{{dasherize name}}.dto.ts",
      templateFile:
        "plop-templates/infrastructure/features/base/dtos/base.dto.hbs",
    },
  ];

  const generateDtoMapper = [
    {
      type: "add",
      path: "src/infrastructure/features/{{dasherize group}}/dtos/{{dasherize name}}-dto.mapper.ts",
      templateFile:
        "plop-templates/infrastructure/features/base/dtos/base-dto.mapper.hbs",
    },
  ];

  const generateCommandDto = [
    {
      type: "add",
      path: "src/infrastructure/features/{{dasherize group}}/dtos/{{dasherize name}}-command.dto.ts",
      templateFile:
        "plop-templates/infrastructure/features/base/dtos/base-command.dto.hbs",
    },
    {
      type: "add",
      path: "src/infrastructure/features/{{dasherize group}}/dtos/{{dasherize name}}-command-response.dto.ts",
      templateFile:
        "plop-templates/infrastructure/features/base/dtos/base-command-response.dto.hbs",
    },
  ];

  const generateQueryDto = [
    {
      type: "add",
      path: "src/infrastructure/features/{{dasherize group}}/dtos/{{dasherize name}}-query.dto.ts",
      templateFile:
        "plop-templates/infrastructure/features/base/dtos/base-query.dto.hbs",
    },
    {
      type: "add",
      path: "src/infrastructure/features/{{dasherize group}}/dtos/{{dasherize name}}-query-response.dto.ts",
      templateFile:
        "plop-templates/infrastructure/features/base/dtos/base-query-response.dto.hbs",
    },
  ];

  const generatePattern = [
    {
      type: "add",
      path: "src/core/domain/{{dasherize group}}/i-{{dasherize name}}.{{dasherizeSingular pattern}}.ts",
      templateFile: "plop-templates/core/domain/base/i-base-pattern.hbs",
    },
    {
      type: "add",
      path: "src/infrastructure/features/{{dasherize group}}/{{dasherize name}}.{{dasherizeSingular pattern}}.ts",
      templateFile:
        "plop-templates/infrastructure/features/base/base.pattern.hbs",
    },
  ];


  plop.setGenerator("core:model", {
    description: "Generate model",
    prompts: groupPrompts,
    actions: generateModel,
  });

  plop.setGenerator("core:interface", {
    description: "Generate interface",
    prompts: groupPrompts,
    actions: generateInterface,
  });

  plop.setGenerator("core:enum", {
    description: "Generate enum",
    prompts: groupPrompts,
    actions: generateEnum,
  });

  plop.setGenerator("core:repository", {
    description: "Generate repository port",
    prompts: groupPrompts,
    actions: generateRepositoryPort,
  });

  plop.setGenerator("core:service", {
    description: "Generate service port",
    prompts: groupPrompts,
    actions: generateServicePort,
  });

  plop.setGenerator("core:exception", {
    description: "Generate exception",
    prompts: groupPrompts,
    actions: generateException,
  });

  plop.setGenerator("app:query", {
    description: "Generate query",
    prompts: groupPrompts,
    actions: [...generateQuery, ...generateQueryDto],
  });

  plop.setGenerator("app:command", {
    description: "Generate command",
    prompts: groupPrompts,
    actions: [...generateCommand, ...generateCommandDto],
  });

  plop.setGenerator("infra:repository", {
    description: "Generate repository",
    prompts: groupPrompts,
    actions: [...generateRepositoryPort, ...generateRepository],
  });

  plop.setGenerator("infra:service", {
    description: "Generate service",
    prompts: groupPrompts,
    actions: [...generateServicePort, ...generateService],
  });

  plop.setGenerator("infra:dtos", {
    description: "Generate dtos",
    prompts: groupPrompts,
    actions: generateDto,
  });

  plop.setGenerator("infra:mapper", {
    description: "Generate dtos mapper",
    prompts: groupPrompts,
    actions: generateDtoMapper,
  });

  plop.setGenerator("infra:controller", {
    description: "Generate controller",
    prompts: groupPrompts,
    actions: generateController,
  });

  plop.setGenerator("infra:pattern", {
    description: "Generate pattern implementation",
    prompts: patternPrompts,
    actions: generatePattern,
  });

  plop.setGenerator("crud:entity", {
    description: "Generate CRUD en",
    prompts: groupPrompts,
    actions: [
      ...generateModel,
      ...generateEntity,
      ...generateRepositoryPort,
      ...generateRepository,
    ],
  });

  plop.setGenerator("crud:controller", {
    description: "Generate CRUD endpoint",
    prompts: groupPrompts,
    actions: [...generateController],
  });

  plop.setGenerator("crud:entity_and_controller", {
    description: "Generate CRUD endpoint",
    prompts: groupPrompts,
    actions: [
      ...generateModel,
      ...generateEntity,
      ...generateDto,
      ...generateDtoMapper,
      ...generateRepositoryPort,
      ...generateRepository,
      ...generateController,
      ...generateDomainExporter,
      ...generateInfraExporter,
    ],
  });
};
