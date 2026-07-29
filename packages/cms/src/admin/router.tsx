import { rootRoute } from "@/routes/__root";
import { appLayoutRoute } from "@/routes/app-layout";

// Core
import { loginRoute } from "@/routes/login";
import { notFoundRoute } from "@/routes/not-found";

// Dashboard (under app layout)
import { indexRoute } from "@/routes/index";

// Collections
import { collectionsIndexRoute } from "@/routes/collections/index";
import { collectionDetailRoute } from "@/routes/collections/$slug";
import { newEntryRoute } from "@/routes/collections/new.$slug";
import { editEntryRoute } from "@/routes/collections/$slug.$id.edit";

// Globals
import { globalsIndexRoute } from "@/routes/globals/index";
import { globalDetailRoute } from "@/routes/globals/$slug";

// Media
import { mediaRoute } from "@/routes/media/index";

// Users
import { usersIndexRoute } from "@/routes/users/index";
import { newUserRoute } from "@/routes/users/new";
import { userDetailRoute } from "@/routes/users/$id";

// Roles
import { rolesIndexRoute } from "@/routes/roles/index";
import { newRoleRoute } from "@/routes/roles/new";
import { roleDetailRoute } from "@/routes/roles/$id";

// Schemas
import { schemasIndexRoute } from "@/routes/schemas/index";
import { newSchemaRoute } from "@/routes/schemas/new";
import { schemaDetailRoute } from "@/routes/schemas/$type.$slug";

// Settings
import { settingsIndexRoute } from "@/routes/settings/index";
import { apiTokensRoute } from "@/routes/settings/api-tokens";
import { pluginsRoute } from "@/routes/settings/plugins";
import { settingsUsersRoute } from "@/routes/settings/users/index";
import { settingsNewUserRoute } from "@/routes/settings/users/new";
import { settingsUserDetailRoute } from "@/routes/settings/users/$id";
import { settingsRolesRoute } from "@/routes/settings/roles/index";
import { settingsNewRoleRoute } from "@/routes/settings/roles/new";
import { settingsRoleDetailRoute } from "@/routes/settings/roles/$id";
import { settingsWebhooksRoute } from "@/routes/settings/webhooks/index";
import { settingsNewWebhookRoute } from "@/routes/settings/webhooks/new";
import { settingsWebhookDetailRoute } from "@/routes/settings/webhooks/$id";

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
