/// <reference types="" />
declare namespace Lucia {
  type Auth = typeof import("~/lib/db.server").auth;
  type UserAttributes = {
    verified: number;
    email: string;
  };
}
