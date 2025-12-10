import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: {
    timestamp?: string;
    [key: string]: any;
  };
}

export interface MetaOptions {
  timestamp?: boolean;
  [key: string]: any;
}

const buildMeta = (meta?: MetaOptions): ApiResponse["meta"] | undefined => {
  if (!meta) return undefined;

  const metaObj: ApiResponse["meta"] = {};

  // Add timestamp by default unless explicitly disabled
  if (meta.timestamp !== false) {
    metaObj.timestamp = new Date().toISOString();
  }

  // Add all other meta properties
  Object.keys(meta).forEach((key) => {
    if (key !== "timestamp") {
      metaObj[key] = meta[key];
    }
  });

  return Object.keys(metaObj).length > 0 ? metaObj : undefined;
};

export const sendResponse = <T = any>(
  res: Response,
  statusCode: number,
  data?: T,
  message?: string,
  meta?: MetaOptions
): void => {
  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    ...(message && { message }),
    ...(data !== undefined && { data }),
    ...(buildMeta(meta) && { meta: buildMeta(meta) }),
  };

  res.status(statusCode).json(response);
};

export const sendSuccess = <T = any>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200,
  meta?: MetaOptions
): void => {
  sendResponse(res, statusCode, data, message, meta);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  meta?: MetaOptions
): void => {
  const response: ApiResponse = {
    success: false,
    error: message,
    ...(buildMeta(meta) && { meta: buildMeta(meta) }),
  };

  res.status(statusCode).json(response);
};
