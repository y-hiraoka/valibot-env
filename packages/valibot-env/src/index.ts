import * as v from "valibot";

type RequiredAtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

type SchemaRecord = Record<
  string,
  v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
>;

type SchemaWithErrorMessages<
  Prefix extends string,
  Schema extends SchemaRecord,
> = {
  [Key in keyof Schema]: Key extends `${Prefix}${string}`
    ? Schema[Key]
    : `TypeError: The schema key must start with ${Prefix}`;
};

type CreateEnvArgs<
  PublicPrefix extends string = "",
  PrivatePrefix extends string = "",
  PublicSchemaRecord extends SchemaRecord = {},
  PrivateSchemaRecord extends SchemaRecord = {},
  SharedSchemaRecord extends SchemaRecord = {},
> = {
  publicPrefix?: PublicPrefix;
  privatePrefix?: PrivatePrefix;
  schema: RequiredAtLeastOne<{
    public: SchemaWithErrorMessages<PublicPrefix, PublicSchemaRecord>;
    private: SchemaWithErrorMessages<PrivatePrefix, PrivateSchemaRecord>;
    shared: SharedSchemaRecord;
  }>;
  values: Record<string, unknown>;
  isPublic?: boolean;
};

type CreatedEnv<
  PublicSchemaRecord extends SchemaRecord = {},
  PrivateSchemaRecord extends SchemaRecord = {},
  SharedSchemaRecord extends SchemaRecord = {},
> = {
  [Key in keyof PublicSchemaRecord]: v.InferOutput<PublicSchemaRecord[Key]>;
} & {
  [Key in keyof PrivateSchemaRecord]: v.InferOutput<PrivateSchemaRecord[Key]>;
} & {
  [Key in keyof SharedSchemaRecord]: v.InferOutput<SharedSchemaRecord[Key]>;
};

export function createEnv<
  PublicPrefix extends string = "",
  PrivatePrefix extends string = "",
  PublicSchemaRecord extends SchemaRecord = {},
  PrivateSchemaRecord extends SchemaRecord = {},
  SharedSchemaRecord extends SchemaRecord = {},
>(
  args: CreateEnvArgs<
    PublicPrefix,
    PrivatePrefix,
    PublicSchemaRecord,
    PrivateSchemaRecord,
    SharedSchemaRecord
  >,
): CreatedEnv<PublicSchemaRecord, PrivateSchemaRecord, SharedSchemaRecord> {
  const isPublic = args.isPublic ?? typeof window !== "undefined";
  // const publicPrefix = args.publicPrefix ?? "";
  // const privatePrefix = args.privatePrefix ?? "";

  let parsed: any = {};

  const publicSchemaRecord = args.schema.public ?? {};
  const privateSchemaRecord = args.schema.private ?? {};
  const sharedSchemaRecord = args.schema.shared ?? {};

  for (const [key, valischema] of Object.entries(publicSchemaRecord)) {
    parsed[key] = v.parse(valischema as v.GenericSchema, args.values[key]);
  }

  for (const [key, valischema] of Object.entries(sharedSchemaRecord)) {
    parsed[key] = v.parse(valischema as v.GenericSchema, args.values[key]);
  }

  if (!isPublic) {
    for (const [key, valischema] of Object.entries(privateSchemaRecord)) {
      parsed[key] = v.parse(valischema as v.GenericSchema, args.values[key]);
    }
  }

  return parsed;
}

const onlyPublicEnv = createEnv({
  publicPrefix: "PUBLIC_",
  schema: {
    public: {
      PUBLIC_HOGE: v.string(),
    },
  },
  values: {
    PUBLIC_HOGE: "foo",
  },
});

onlyPublicEnv.PUBLIC_HOGE;

const onlyPrivateEnv = createEnv({
  publicPrefix: "PUBLIC_",
  privatePrefix: "PRIVATE_",
  schema: {
    private: {
      PRIVATE_HOGE: v.string(),
    },
  },
  values: {
    PRIVATE_HOGE: "foo",
  },
});

onlyPrivateEnv.PRIVATE_HOGE;

const sharedEnv = createEnv({
  schema: {
    shared: {
      NODE_ENV: v.union([v.literal("development"), v.literal("production")]),
    },
  },
  values: {
    NODE_ENV: "development",
  },
});

sharedEnv.NODE_ENV;

const publicAndPrivateEnv = createEnv({
  publicPrefix: "PUBLIC_",
  privatePrefix: "PRIVATE_",
  schema: {
    public: {
      PUBLIC_HOGE: v.string(),
    },
    private: {
      PRIVATE_HOGE: v.string(),
    },
  },
  values: {
    PUBLIC_HOGE: "foo",
    PRIVATE_HOGE: "foo",
  },
});

publicAndPrivateEnv.PUBLIC_HOGE;
publicAndPrivateEnv.PRIVATE_HOGE;

const publicAndSharedEnv = createEnv({
  publicPrefix: "PUBLIC_",
  schema: {
    public: {
      PUBLIC_HOGE: v.string(),
    },
    shared: {
      NODE_ENV: v.union([v.literal("development"), v.literal("production")]),
    },
  },
  values: {
    PUBLIC_HOGE: "foo",
    NODE_ENV: "development",
  },
});

publicAndSharedEnv.PUBLIC_HOGE;
publicAndSharedEnv.NODE_ENV;

const privateAndSharedEnv = createEnv({
  privatePrefix: "PRIVATE_",
  schema: {
    private: {
      PRIVATE_HOGE: v.string(),
    },
    shared: {
      NODE_ENV: v.union([v.literal("development"), v.literal("production")]),
    },
  },
  values: {
    PRIVATE_HOGE: "foo",
    NODE_ENV: "development",
  },
});

privateAndSharedEnv.PRIVATE_HOGE;
privateAndSharedEnv.NODE_ENV;

const myenv = createEnv({
  publicPrefix: "PUBLIC_",
  privatePrefix: "PRIVATE_",
  schema: {
    private: {
      PRIVATE_HOGE: v.string(),
      PRIVATE_FUGA: v.string(),
    },
    public: {
      PUBLIC_FUGA: v.string(),
    },
    shared: {
      NODE_ENV: v.union([v.literal("development"), v.literal("production")]),
    },
  },
  values: {
    PRIVATE_HOGE: "foo",
    PUBLIC_FUGA: "bar",
    NODE_ENV: "development",
  },
});

myenv.PUBLIC_FUGA;
myenv.PRIVATE_HOGE;
myenv.NODE_ENV;
