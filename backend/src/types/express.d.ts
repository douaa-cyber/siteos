// src/types/express.d.ts
import { JwtPayload } from "jsonwebtoken";
interface JwtPayloadCustom {
  id: number;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadCustom;
    }
  }
}
