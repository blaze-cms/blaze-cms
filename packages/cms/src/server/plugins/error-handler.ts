import type { FastifyInstance, FastifyError } from "fastify";

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error: FastifyError | Error, _request, reply) => {
    app.log.error(error);
    const err = error as FastifyError;
    const statusCode = err.statusCode ?? 500;
    reply.code(statusCode).send({
      error: statusCode >= 500 ? "Internal Server Error" : err.message,
      statusCode,
    });
  });
}
