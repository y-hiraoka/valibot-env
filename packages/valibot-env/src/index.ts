import * as v from "valibot";
import type {
  CreatedEnv,
  PrivateSchemaRecord,
  PublicSchemaRecord,
  RequiredAtLeastOne,
  SchemaRecord,
} from "./types.js";

export type CreateEnvArgs<
  TPublicPrefix extends string | undefined,
  TPrivatePrefix extends string | undefined,
  TPublicSchemaRecord extends SchemaRecord = {},
  TPrivateSchemaRecord extends SchemaRecord = {},
  TSharedSchemaRecord extends SchemaRecord = {},
> = {
  publicPrefix?: TPublicPrefix;
  privatePrefix?: TPrivatePrefix;
  schema: RequiredAtLeastOne<{
    public: PublicSchemaRecord<
      TPublicPrefix,
      TPrivatePrefix,
      TPublicSchemaRecord
    >;
    private: PrivateSchemaRecord<
      TPublicPrefix,
      TPrivatePrefix,
      TPrivateSchemaRecord
    >;
    shared: TSharedSchemaRecord;
  }>;
  values: Record<string, unknown>;
  isPrivate?: boolean;
};

export function createEnv<
  TPublicPrefix extends string | undefined = undefined,
  TPrivatePrefix extends string | undefined = undefined,
  TPublicSchemaRecord extends SchemaRecord = {},
  TPrivateSchemaRecord extends SchemaRecord = {},
  TSharedSchemaRecord extends SchemaRecord = {},
>(
  args: CreateEnvArgs<
    TPublicPrefix,
    TPrivatePrefix,
    TPublicSchemaRecord,
    TPrivateSchemaRecord,
    TSharedSchemaRecord
  >,
): CreatedEnv<TPublicSchemaRecord, TPrivateSchemaRecord, TSharedSchemaRecord> {
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
      TPublicSchemaRecord,
      TPrivateSchemaRecord,
      TSharedSchemaRecord
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
