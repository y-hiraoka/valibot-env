import * as v from "valibot";

type RequiredAtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export type SchemaRecord = Record<
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

export type CreateEnvArgs<
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

  let schemaRecord = {
    ...args.schema.public,
    ...args.schema.shared,
  } as SchemaRecord;

  if (isPrivate) {
    schemaRecord = {
      ...schemaRecord,
      ...args.schema.private,
    } as SchemaRecord;
  }

  try {
    return v.parse(v.object(schemaRecord), args.values) as CreatedEnv<
      PublicSchemaRecord,
      PrivateSchemaRecord,
      SharedSchemaRecord
    >;
  } catch (error) {
    if (v.isValiError(error)) {
      const invalidPaths = error.issues
        .map((issue) => "\t" + [v.getDotPath(issue), issue.message].join(": "))
        .join("\n");

      throw new Error(
        `[valibot-env] Invalid environment variable values detected. Please check the following variables:
${invalidPaths}`,
        { cause: error },
      );
    }

    throw error;
  }
}
