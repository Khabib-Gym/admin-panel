export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Gyms
  gyms: {
    all: ['gyms'] as const,
    lists: () => [...queryKeys.gyms.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.gyms.lists(), filters] as const,
    details: () => [...queryKeys.gyms.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.gyms.details(), id] as const,
    analytics: (id: string) => [...queryKeys.gyms.detail(id), 'analytics'] as const,
    members: (id: string) => [...queryKeys.gyms.detail(id), 'members'] as const,
  },

  // Classes
  classes: {
    all: ['classes'] as const,
    lists: () => [...queryKeys.classes.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.classes.lists(), filters] as const,
    details: () => [...queryKeys.classes.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.classes.details(), id] as const,
    bookings: (id: string) => [...queryKeys.classes.detail(id), 'bookings'] as const,
  },

  // Coaches
  coaches: {
    all: ['coaches'] as const,
    lists: () => [...queryKeys.coaches.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.coaches.lists(), filters] as const,
    details: () => [...queryKeys.coaches.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.coaches.details(), id] as const,
    profile: () => [...queryKeys.coaches.all, 'profile'] as const,
    availability: (id: string) => [...queryKeys.coaches.detail(id), 'availability'] as const,
    sessions: () => [...queryKeys.coaches.all, 'sessions'] as const,
    analytics: () => [...queryKeys.coaches.all, 'analytics'] as const,
    revenue: () => [...queryKeys.coaches.all, 'revenue'] as const,
  },

  // Sessions (private)
  sessions: {
    all: ['sessions'] as const,
    lists: () => [...queryKeys.sessions.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.sessions.lists(), filters] as const,
    details: () => [...queryKeys.sessions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.sessions.details(), id] as const,
  },

  // Content
  content: {
    blog: {
      all: ['blog'] as const,
      posts: () => [...queryKeys.content.blog.all, 'posts'] as const,
      post: (id: string) => [...queryKeys.content.blog.posts(), id] as const,
      categories: () => [...queryKeys.content.blog.all, 'categories'] as const,
    },
    exercises: {
      all: ['exercises'] as const,
      lists: () => [...queryKeys.content.exercises.all, 'list'] as const,
      list: (filters: Record<string, unknown>) =>
        [...queryKeys.content.exercises.lists(), filters] as const,
      detail: (id: string) => [...queryKeys.content.exercises.all, id] as const,
    },
    workouts: {
      all: ['workouts'] as const,
      templates: () => [...queryKeys.content.workouts.all, 'templates'] as const,
      template: (id: string) => [...queryKeys.content.workouts.templates(), id] as const,
    },
  },

  // Achievements
  achievements: {
    all: ['achievements'] as const,
    lists: () => [...queryKeys.achievements.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.achievements.all, id] as const,
  },

  // Memberships
  memberships: {
    all: ['memberships'] as const,
    lists: () => [...queryKeys.memberships.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.memberships.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.memberships.all, id] as const,
  },

  // Analytics
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    gym: (id: string) => [...queryKeys.analytics.all, 'gym', id] as const,
  },
} as const;
