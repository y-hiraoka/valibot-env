import type * as v from "valibot";

export type SchemaRecord = Record<
  string,
  v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
>;

export type RequiredAtLeastOne<
  T,
  U = { [K in keyof T]: Pick<T, K> },
> = Partial<T> & U[keyof U];

export type CreatedEnv<
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

export type PublicSchemaRecord<
  PublicPrefix extends string | undefined,
  PrivatePrefix extends string | undefined,
  PublicSchemaRecord extends SchemaRecord,
> = {
  [Key in keyof PublicSchemaRecord]: PublicPrefix extends string
    ? Key extends `${PublicPrefix}${string}`
      ? PublicSchemaRecord[Key]
      : PrivatePrefix extends string
        ? Key extends `${PrivatePrefix}${string}`
          ? `TypeError: Env prefixed with ${PrivatePrefix} must be set to schema.private`
          : `TypeError: Env must be prefixed with ${PublicPrefix}`
        : `TypeError: Env must be prefixed with ${PublicPrefix}`
    : PrivatePrefix extends string
      ? Key extends `${PrivatePrefix}${string}`
        ? `TypeError: Env prefixed with ${PrivatePrefix} must be set to schema.private`
        : PublicSchemaRecord[Key]
      : PublicSchemaRecord[Key];
};

export type PrivateSchemaRecord<
  PublicPrefix extends string | undefined,
  PrivatePrefix extends string | undefined,
  PrivateSchemaRecord extends SchemaRecord,
> = {
  [Key in keyof PrivateSchemaRecord]: PrivatePrefix extends string
    ? Key extends `${PrivatePrefix}${string}`
      ? PrivateSchemaRecord[Key]
      : PublicPrefix extends string
        ? Key extends `${PublicPrefix}${string}`
          ? `TypeError: Env prefixed with ${PublicPrefix} must be set to schema.public`
          : `TypeError: Env must be prefixed with ${PrivatePrefix}`
        : `TypeError: Env must be prefixed with ${PrivatePrefix}`
    : PublicPrefix extends string
      ? Key extends `${PublicPrefix}${string}`
        ? `TypeError: Env prefixed with ${PublicPrefix} must be set to schema.public`
        : PrivateSchemaRecord[Key]
      : PrivateSchemaRecord[Key];
};
