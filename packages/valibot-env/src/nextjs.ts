import {
  CreateEnvArgs as CreateEnvArgsCore,
  createEnv as createEnvCore,
  SchemaRecord,
} from ".";

type CreateEnvArgs<
  PublicSchemaRecord extends SchemaRecord = {},
  PrivateSchemaRecord extends SchemaRecord = {},
  SharedSchemaRecord extends SchemaRecord = {},
  Values extends Record<
    | keyof PublicSchemaRecord
    | keyof PrivateSchemaRecord
    | keyof SharedSchemaRecord,
    unknown
  > = Record<
    | keyof PublicSchemaRecord
    | keyof PrivateSchemaRecord
    | keyof SharedSchemaRecord,
    unknown
  >,
> = Pick<
  CreateEnvArgsCore<
    "NEXT_PUBLIC_",
    "",
    PublicSchemaRecord,
    PrivateSchemaRecord,
    SharedSchemaRecord
  >,
  "schema" | "isPrivate"
> & {
  values: Values;
};

export function createEnv<
  PublicSchemaRecord extends SchemaRecord = {},
  PrivateSchemaRecord extends SchemaRecord = {},
  SharedSchemaRecord extends SchemaRecord = {},
  Values extends Record<
    | keyof PublicSchemaRecord
    | keyof PrivateSchemaRecord
    | keyof SharedSchemaRecord,
    unknown
  > = Record<
    | keyof PublicSchemaRecord
    | keyof PrivateSchemaRecord
    | keyof SharedSchemaRecord,
    unknown
  >,
>(
  args: CreateEnvArgs<
    PublicSchemaRecord,
    PrivateSchemaRecord,
    SharedSchemaRecord,
    Values
  >,
) {
  return createEnvCore({
    publicPrefix: "NEXT_PUBLIC_",
    privatePrefix: "",
    isPrivate: args.isPrivate,
    schema: args.schema,
    values: args.values,
  });
}
