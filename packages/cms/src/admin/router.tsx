import { rootRoute } from "@/routes/__root";
import { appLayoutRoute } from "@/routes/app-layout";
import { collectionDetailRoute } from "@/routes/collections/$slug";
import { editEntryRoute } from "@/routes/collections/$slug.$id.edit";
// Collections
import { collectionsIndexRoute } from "@/routes/collections/index";
import { newEntryRoute } from "@/routes/collections/new.$slug";
import { globalDetailRoute } from "@/routes/globals/$slug";
// Globals
import { globalsIndexRoute } from "@/routes/globals/index";
// Dashboard (under app layout)
import { indexRoute } from "@/routes/index";
// Core
import { loginRoute } from "@/routes/login";
// Media
import { mediaRoute } from "@/routes/media/index";
import { notFoundRoute } from "@/routes/not-found";
import { roleDetailRoute } from "@/routes/roles/$id";
// Roles
import { rolesIndexRoute } from "@/routes/roles/index";
import { newRoleRoute } from "@/routes/roles/new";
import { schemaDetailRoute } from "@/routes/schemas/$type.$slug";
// Schemas
import { schemasIndexRoute } from "@/routes/schemas/index";
import { newSchemaRoute } from "@/routes/schemas/new";
import { apiTokensRoute } from "@/routes/settings/api-tokens";
// Settings
import { settingsIndexRoute } from "@/routes/settings/index";
import { pluginsRoute } from "@/routes/settings/plugins";
import { settingsRoleDetailRoute } from "@/routes/settings/roles/$id";
import { settingsRolesRoute } from "@/routes/settings/roles/index";
import { settingsNewRoleRoute } from "@/routes/settings/roles/new";
import { settingsUserDetailRoute } from "@/routes/settings/users/$id";
import { settingsUsersRoute } from "@/routes/settings/users/index";
import { settingsNewUserRoute } from "@/routes/settings/users/new";
import { settingsWebhookDetailRoute } from "@/routes/settings/webhooks/$id";
import { settingsWebhooksRoute } from "@/routes/settings/webhooks/index";
import { settingsNewWebhookRoute } from "@/routes/settings/webhooks/new";
import { userDetailRoute } from "@/routes/users/$id";
// Users
import { usersIndexRoute } from "@/routes/users/index";
import { newUserRoute } from "@/routes/users/new";

export const routeTree = rootRoute.addChildren([
  loginRoute,
  notFoundRoute,
  appLayoutRoute.addChildren([
    indexRoute,
    collectionsIndexRoute,
    collectionDetailRoute,
    newEntryRoute,
    editEntryRoute,
    globalsIndexRoute,
    globalDetailRoute,
    mediaRoute,
    usersIndexRoute,
    newUserRoute,
    userDetailRoute,
    rolesIndexRoute,
    newRoleRoute,
    roleDetailRoute,
    schemasIndexRoute,
    newSchemaRoute,
    schemaDetailRoute,
    settingsIndexRoute,
    apiTokensRoute,
    pluginsRoute,
    settingsUsersRoute,
    settingsNewUserRoute,
    settingsUserDetailRoute,
    settingsRolesRoute,
    settingsNewRoleRoute,
    settingsRoleDetailRoute,
    settingsWebhooksRoute,
    settingsNewWebhookRoute,
    settingsWebhookDetailRoute,
  ]),
]);
