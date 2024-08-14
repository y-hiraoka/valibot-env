import type {
  CreatedEnv,
  PrivateSchemaRecord,
  PublicSchemaRecord,
  RequiredAtLeastOne,
  SchemaRecord,
} from "./types";
import { createEnv as createEnvCore } from ".";

type CreateEnvArgs<
  TPublicSchemaRecord extends SchemaRecord = {},
  TPrivateSchemaRecord extends SchemaRecord = {},
  TSharedSchemaRecord extends SchemaRecord = {},
  Values extends Record<
    | keyof TPublicSchemaRecord
    | keyof TPrivateSchemaRecord
    | keyof TSharedSchemaRecord,
    unknown
  > = Record<
    | keyof TPublicSchemaRecord
    | keyof TPrivateSchemaRecord
    | keyof TSharedSchemaRecord,
    unknown
  >,
> = {
  schema: RequiredAtLeastOne<{
    public: PublicSchemaRecord<"NEXT_PUBLIC_", undefined, TPublicSchemaRecord>;
    private: PrivateSchemaRecord<
      "NEXT_PUBLIC_",
      undefined,
      TPrivateSchemaRecord
    >;
    shared: TSharedSchemaRecord;
  }>;
  values: Values;
  isPrivate?: boolean;
};

export function createEnv<
  TPublicSchemaRecord extends SchemaRecord = {},
  TPrivateSchemaRecord extends SchemaRecord = {},
  TSharedSchemaRecord extends SchemaRecord = {},
  Values extends Record<
    | keyof TPublicSchemaRecord
    | keyof TPrivateSchemaRecord
    | keyof TSharedSchemaRecord,
    unknown
  > = Record<
    | keyof TPublicSchemaRecord
    | keyof TPrivateSchemaRecord
    | keyof TSharedSchemaRecord,
    unknown
  >,
>(
  args: CreateEnvArgs<
    TPublicSchemaRecord,
    TPrivateSchemaRecord,
    TSharedSchemaRecord,
    Values
  >,
): CreatedEnv<TPublicSchemaRecord, TPrivateSchemaRecord, TSharedSchemaRecord> {
  return createEnvCore({
    publicPrefix: "NEXT_PUBLIC_",
    privatePrefix: "",
    isPrivate: args.isPrivate,
    schema: args.schema,
    values: args.values,
  });
}
