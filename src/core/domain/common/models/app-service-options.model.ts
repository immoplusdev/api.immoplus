export interface AppServiceOptions {
  knex?: any;
  accountability?: AppServiceOptionsAccountability;
  schema: any;
  getAdminInstance(): AppServiceOptions;
}

export interface AppServiceOptionsAccountability {
  role: string | null;
  user?: string | null;
  admin?: boolean;
  app?: boolean;
  permissions?: any[];
  share?: string;
  share_scope?: {
    collection: string;
    item: string;
  };
  ip?: string;
  userAgent?: string;
  origin?: string;
}
