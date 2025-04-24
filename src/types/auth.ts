export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Session = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  impersonatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthSession = {
  user: User;
  session: Session;
};
