const {
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
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('inflection');

module.exports = function (plop) {
  plop.setHelper('upperCase', (text) => text.toUpperCase());
  plop.setHelper('lowerCase', (text) => text.toLowerCase());
  plop.setHelper('camelCase', (text) =>
    camelize(text.replaceAll('-', '_'), true),
  );
  plop.setHelper('plural', (text) => pluralize(text.replaceAll('-', '_')));
  plop.setHelper('singular', (text) => singularize(text.replaceAll('-', '_')));
  plop.setHelper('upperCaseFirst', (text) =>
    camelize(text.replaceAll('-', '_'), true),
  );
  plop.setHelper('lowerCaseFirst', (text) =>
    camelize(text.replaceAll('-', '_'), false),
  );
  plop.setHelper('dasherize', (text) => dasherize(text.replaceAll('-', '_')));
  plop.setHelper('underscore', (text) => underscore(text.replaceAll('-', '_')));
  plop.setHelper('humanize', (text) => humanize(text.replaceAll('-', '_')));
  plop.setHelper('capitalize', (text) => capitalize(text.replaceAll('-', '_')));
  plop.setHelper('titleize', (text) => titleize(text.replaceAll('-', '_')));
  plop.setHelper('tableize', (text) => tableize(text.replaceAll('-', '_')));
  plop.setHelper('classify', (text) => classify(text.replaceAll('-', '_')));

  const generalPrompts = [
    {
      type: 'input',
      name: 'name',
      message: 'entity name',
    },
  ];

  const groupPrompts = [
    {
      type: 'input',
      name: 'name',
      message: 'entity name',
    },
    {
      type: 'input',
      name: 'group',
      message: 'group name',
    },
  ];

  const generateCommand = [
    {
      type: 'add',
      path: 'src/core/application/features/{{dasherize group}}/commands/{{dasherize name}}.command.ts',
      templateFile: 'plop-templates/application/user/commands/user.command.hbs',
    },
    {
      type: 'add',
      path: 'src/core/application/features/{{dasherize group}}/command-handlers/{{dasherize name}}-command-handler.service.ts',
      templateFile:
        'plop-templates/application/user/command-handlers/user-command-handler.service.hbs',
    },
    {
      type: 'add',
      path: 'src/core/application/features/{{dasherize group}}/responses/{{dasherize name}}-command.response.ts',
      templateFile:
        'plop-templates/application/user/responses/user-command.response.hbs',
    },
  ];

  const generateQuery = [
    {
      type: 'add',
      path: 'src/core/application/features/{{dasherize group}}/queries/{{dasherize name}}.query.ts',
      templateFile: 'plop-templates/application/user/queries/user.query.hbs',
    },
    {
      type: 'add',
      path: 'src/core/application/features/{{dasherize group}}/query-handlers/{{dasherize name}}-query-handler.service.ts',
      templateFile:
        'plop-templates/application/user/query-handlers/user-query-handler.service.hbs',
    },
    {
      type: 'add',
      path: 'src/core/application/features/{{dasherize group}}/responses/{{dasherize name}}-query.response.ts',
      templateFile:
        'plop-templates/application/user/responses/user-query.response.hbs',
    },
  ];

  const generateCommandDto = [
    {
      type: 'add',
      path: 'src/infrastructure/swagger-adapter/{{dasherize group}}/{{dasherize name}}-command.dto.ts',
      templateFile: 'plop-templates/application/user/dtos/user-command.dto.hbs',
    },
  ];

  const generateQueryDto = [
    {
      type: 'add',
      path: 'src/infrastructure/swagger-adapter/{{dasherize group}}/{{dasherize name}}-query.dto.ts',
      templateFile: 'plop-templates/application/user/dtos/user-query.dto.hbs',
    },
  ];

  const generateModel = [
    {
      type: 'add',
      path: 'src/core/domain/models/{{dasherize name}}.ts',
      templateFile: 'plop-templates/domain/model/user.hbs',
    },
  ];

  const generateDomainRepository = [
    {
      type: 'add',
      path: 'src/core/domain/ports/{{dasherize name}}-repository.port.ts',
      templateFile: 'plop-templates/domain/ports/crud-repository.port.hbs',
    },
  ];

  const generateMongoAdapter = [
    {
      type: 'add',
      path: 'src/infrastructure/mongo-adapter/{{dasherize name}}/mg-{{dasherize name}}.module.ts',
      templateFile: 'plop-templates/mongo-adapter/user/mg-user.module.hbs',
    },
    {
      type: 'add',
      path: 'src/infrastructure/mongo-adapter/{{dasherize name}}/mg-{{dasherize name}}.schema.ts',
      templateFile: 'plop-templates/mongo-adapter/user/mg-user.schema.hbs',
    },
    {
      type: 'add',
      path: 'src/infrastructure/mongo-adapter/{{dasherize name}}/mg-{{dasherize name}}.mapper.ts',
      templateFile: 'plop-templates/mongo-adapter/user/mg-user-mapper.hbs',
    },
    {
      type: 'add',
      path: 'src/infrastructure/mongo-adapter/{{dasherize name}}/mg-{{dasherize name}}-repository.service.ts',
      templateFile:
        'plop-templates/mongo-adapter/user/mg-user-repository.service.hbs',
    },
  ];

  const generateSwaggerAdapter = [
    {
      type: 'add',
      path: 'src/infrastructure/swagger-adapter/{{dasherize name}}/{{dasherize name}}.dto.ts',
      templateFile: 'plop-templates/swagger-adapter/user/user.dto.hbs',
    },
    {
      type: 'add',
      path: 'src/infrastructure/swagger-adapter/{{dasherize name}}/create-{{dasherize name}}-command.dto.ts',
      templateFile:
        'plop-templates/swagger-adapter/user/create-user-command.dto.hbs',
    },
    {
      type: 'add',
      path: 'src/infrastructure/swagger-adapter/{{dasherize name}}/mappers/create-{{dasherize name}}-command-dto.mapper.ts',
      templateFile:
        'plop-templates/swagger-adapter/user/mappers/create-user-command-dto.mapper.hbs',
    },
    {
      type: 'add',
      path: 'src/infrastructure/swagger-adapter/{{dasherize name}}/mappers/{{dasherize name}}-dto.mapper.ts',
      templateFile:
        'plop-templates/swagger-adapter/user/mappers/user-dto.mapper.hbs',
    },
  ];

  const generateCrudAdapter = [
    {
      type: 'add',
      path: 'src/infrastructure/crud-adapter/{{dasherize name}}/{{dasherize name}}-crud.controller.ts',
      templateFile: 'plop-templates/crud-adapter/user/user-crud.controller.hbs',
    },
  ];

  const generateRestAdapter = [
    {
      type: 'add',
      path: 'src/infrastructure/rest-adapter/controllers/{{dasherize name}}/{{dasherize name}}.controller.ts',
      templateFile:
        'plop-templates/rest-adapter/controllers/user/user.controller.hbs',
    },
  ];

  plop.setGenerator('core:domain:model', {
    description: 'Génère un nouveau model',
    prompts: generalPrompts,
    actions: generateModel,
  });

  plop.setGenerator('core:domain:repository:crud', {
    description: 'Génère un repository CRUD',
    prompts: generalPrompts,
    actions: generateDomainRepository,
  });

  plop.setGenerator('infra:mongo:adapter', {
    description: 'Génère un adaptateur mongo',
    prompts: generalPrompts,
    actions: generateMongoAdapter,
  });

  plop.setGenerator('infra:swagger:adapter', {
    description: "Genère l'adaptateur swagger d'une entité",
    prompts: generalPrompts,
    actions: generateSwaggerAdapter,
  });

  plop.setGenerator('infra:crud:adapter', {
    description: "Genère l'adaptateur CRUD d'une entité",
    prompts: generalPrompts,
    actions: generateCrudAdapter,
  });

  plop.setGenerator('infra:rest:adapter', {
    description: "Genère l'adaptateur REST d'une entité",
    prompts: generalPrompts,
    actions: generateRestAdapter,
  });

  plop.setGenerator('app:ressource', {
    description: 'Génère une ressource basée sur MongoDB',
    prompts: generalPrompts,
    actions: [
      ...generateModel,
      ...generateDomainRepository,
      ...generateMongoAdapter,
    ],
  });

  plop.setGenerator('app:crud:ressource', {
    description: 'Génère une ressource basée sur MongoDB',
    prompts: generalPrompts,
    actions: [
      ...generateModel,
      ...generateDomainRepository,
      ...generateMongoAdapter,
      ...generateSwaggerAdapter,
      ...generateCrudAdapter,
      ...generateRestAdapter,
    ],
  });

  plop.setGenerator('app:query', {
    description: 'Generate query',
    prompts: groupPrompts,
    actions: [...generateQuery, ...generateQueryDto],
  });

  plop.setGenerator('app:command', {
    description: 'Generate command',
    prompts: groupPrompts,
    actions: [...generateCommand, ...generateCommandDto],
  });
};
