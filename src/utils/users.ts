interface UserAdminParam {
  tier: string
}

export const isUserAdmin = (user: UserAdminParam): boolean => user.tier === 'Admin'
