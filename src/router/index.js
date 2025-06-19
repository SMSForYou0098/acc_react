import { DefaultRouter } from "./default-router";
import { CustomAuthRouter } from "../views/modules/Event/Auth/router/simple-router";

export const IndexRouters = [
  ...DefaultRouter, 
  ...CustomAuthRouter,
];
