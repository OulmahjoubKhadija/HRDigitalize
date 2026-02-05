import useAuth from "./useAuth";
import { ROLES } from "../utils/roles";

export default function usePermissions() {
  const { user } = useAuth();

  const role = user?.role;

  return {
    canViewAll: () =>
      [ROLES.RH, ROLES.SALARIE, ROLES.CHEF_SERVICE].includes(role),

    canEdit: (resourceOwnerId) => {
      if (role === ROLES.RH) return true;
      return user?.id === resourceOwnerId;
    },

    canDelete: (resourceOwnerId) => {
      if (role === ROLES.RH) return true;
      return user?.id === resourceOwnerId;
    },

    isRH: role === ROLES.RH,
  };
}
