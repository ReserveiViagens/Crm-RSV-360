declare global {
  namespace Express {
    interface Request {
      adminUser?: {
        id: string;
        nome?: string | null;
        username?: string | null;
        role: string;
      };
    }
  }
}

export {};
