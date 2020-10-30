import {environment } from '../../environments/environment';

export const baseURL=environment.production?'https://api.taskmanager.com':'http://localhost:3000';
export const listURL=baseURL+'/lists';
export const taskURL=baseURL+'/lists/:listId/task';