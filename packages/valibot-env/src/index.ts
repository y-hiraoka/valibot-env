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
  isPrivate?: boolean;
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
  const isPrivate = args.isPrivate ?? typeof window === "undefined";
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

  if (isPrivate) {
    for (const [key, valischema] of Object.entries(privateSchemaRecord)) {
      parsed[key] = v.parse(valischema as v.GenericSchema, args.values[key]);
    }
  }

  return parsed;
}
