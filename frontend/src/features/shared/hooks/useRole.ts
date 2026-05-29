import { useAuthStore } from "@/features/auth/store/authStore";
import { RoleEnum } from "@/enum/role.enum";

export function useRole() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role ?? RoleEnum.USER;

  return {
    role,
    isAdmin: role === RoleEnum.ADMIN,
    isUser: role === RoleEnum.USER,
  };
}
