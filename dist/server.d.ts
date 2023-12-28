/// <reference types="node" />
import http from 'http';
declare let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
export default server;
