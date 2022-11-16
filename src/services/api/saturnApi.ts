// const api: any = {};
//
// const injectedRtkApi = api.injectEndpoints({
//   endpoints: (build) => ({
//     getUsers: build.query<GetUsersApiResponse, GetUsersApiArg>({
//       query: (queryArg) => ({
//         url: `/users`,
//         params: { username: queryArg.username, orderBy: queryArg.orderBy },
//       }),
//     }),
//     postUsers: build.mutation<PostUsersApiResponse, PostUsersApiArg>({
//       query: (queryArg) => ({
//         url: `/users`,
//         method: 'POST',
//         body: queryArg.user,
//       }),
//     }),
//     getUsersById: build.query<GetUsersByIdApiResponse, GetUsersByIdApiArg>({
//       query: (queryArg) => ({ url: `/users/${queryArg.id}` }),
//     }),
//     putUsersById: build.mutation<PutUsersByIdApiResponse, PutUsersByIdApiArg>({
//       query: (queryArg) => ({
//         url: `/users/${queryArg.id}`,
//         method: 'PUT',
//         body: queryArg.user,
//       }),
//     }),
//     deleteUsersById: build.mutation<
//       DeleteUsersByIdApiResponse,
//       DeleteUsersByIdApiArg
//     >({
//       query: (queryArg) => ({ url: `/users/${queryArg.id}`, method: 'DELETE' }),
//     }),
//     getProjects: build.query<GetProjectsApiResponse, GetProjectsApiArg>({
//       query: (queryArg) => ({
//         url: `/projects`,
//         body: queryArg.body,
//         params: { title: queryArg.title, orderBy: queryArg.orderBy },
//       }),
//     }),
//     postProjects: build.mutation<PostProjectsApiResponse, PostProjectsApiArg>({
//       query: (queryArg) => ({
//         url: `/projects`,
//         method: 'POST',
//         body: queryArg.project,
//       }),
//     }),
//     getProjectsById: build.query<
//       GetProjectsByIdApiResponse,
//       GetProjectsByIdApiArg
//     >({
//       query: (queryArg) => ({ url: `/projects/${queryArg.id}` }),
//     }),
//     putProjectsById: build.mutation<
//       PutProjectsByIdApiResponse,
//       PutProjectsByIdApiArg
//     >({
//       query: (queryArg) => ({ url: `/projects/${queryArg.id}`, method: 'PUT' }),
//     }),
//     deleteProjectsById: build.mutation<
//       DeleteProjectsByIdApiResponse,
//       DeleteProjectsByIdApiArg
//     >({
//       query: (queryArg) => ({
//         url: `/projects/${queryArg.id}`,
//         method: 'DELETE',
//       }),
//     }),
//     getTasks: build.query<GetTasksApiResponse, GetTasksApiArg>({
//       query: (queryArg) => ({
//         url: `/tasks`,
//         body: queryArg.body,
//         params: { noProject: queryArg.noProject, orderBy: queryArg.orderBy },
//       }),
//     }),
//     postTasks: build.mutation<PostTasksApiResponse, PostTasksApiArg>({
//       query: (queryArg) => ({
//         url: `/tasks`,
//         method: 'POST',
//         body: queryArg.task,
//       }),
//     }),
//     getTasksById: build.query<GetTasksByIdApiResponse, GetTasksByIdApiArg>({
//       query: (queryArg) => ({ url: `/tasks/${queryArg.id}` }),
//     }),
//     putTasksById: build.mutation<PutTasksByIdApiResponse, PutTasksByIdApiArg>({
//       query: (queryArg) => ({ url: `/tasks/${queryArg.id}`, method: 'PUT' }),
//     }),
//     deleteTasksById: build.mutation<
//       DeleteTasksByIdApiResponse,
//       DeleteTasksByIdApiArg
//     >({
//       query: (queryArg) => ({ url: `/tasks/${queryArg.id}`, method: 'DELETE' }),
//     }),
//   }),
//   overrideExisting: false,
// });
// export { injectedRtkApi as saturnApi };
// export type GetUsersApiResponse = /** status 200 List of users */ User[];
// export type GetUsersApiArg = {
//   /** Filter users with the matching username */
//   username?: string;
//   /** Order projects by the specified value e.g. (subscribed:true) */
//   orderBy?: string;
// };
// export type PostUsersApiResponse = unknown;
// export type PostUsersApiArg = {
//   /** User object */
//   user: User;
// };
// export type GetUsersByIdApiResponse =
//   /** status 200 Successful Operation */ User;
// export type GetUsersByIdApiArg = {
//   /** id of user to return */
//   id: number;
// };
// export type PutUsersByIdApiResponse =
//   /** status 200 Successful Operation */ User;
// export type PutUsersByIdApiArg = {
//   /** ID of user to update */
//   id: number;
//   /** User object */
//   user: User;
// };
// export type DeleteUsersByIdApiResponse = unknown;
// export type DeleteUsersByIdApiArg = {
//   /** User ID to delete */
//   id: number;
// };
// export type GetProjectsApiResponse = unknown;
// export type GetProjectsApiArg = {
//   /** Filter projects with the matching title */
//   title?: string;
//   /** Order projects by the specified value e.g. (title:desc) */
//   orderBy?: string;
//   /** List of projects */
//   body: Project[];
// };
// export type PostProjectsApiResponse =
//   /** status 200 Succesful Operation */ User;
// export type PostProjectsApiArg = {
//   /** Project object */
//   project: Project;
// };
// export type GetProjectsByIdApiResponse =
//   /** status 200 Successful Operation */ Project;
// export type GetProjectsByIdApiArg = {
//   /** id of project to return */
//   id: number;
// };
// export type PutProjectsByIdApiResponse =
//   /** status 200 Successful Operation */ Project;
// export type PutProjectsByIdApiArg = {
//   /** ID of project to update */
//   id: number;
// };
// export type DeleteProjectsByIdApiResponse = unknown;
// export type DeleteProjectsByIdApiArg = {
//   /** Project ID to delete */
//   id: number;
// };
// export type GetTasksApiResponse = unknown;
// export type GetTasksApiArg = {
//   /** Filter tasks that have no associated project */
//   noProject?: boolean;
//   /** Order taks by the specified value e.g. (title:desc) */
//   orderBy?: string;
//   /** List of tasks */
//   body: Task[];
// };
// export type PostTasksApiResponse = unknown;
// export type PostTasksApiArg = {
//   /** Task object */
//   task: Task;
// };
// export type GetTasksByIdApiResponse =
//   /** status 200 Successful Operation */ Task;
// export type GetTasksByIdApiArg = {
//   /** id of task to return */
//   id: number;
// };
// export type PutTasksByIdApiResponse =
//   /** status 200 Successful Operation */ Task;
// export type PutTasksByIdApiArg = {
//   /** ID of task to update */
//   id: number;
// };
// export type DeleteTasksByIdApiResponse = unknown;
// export type DeleteTasksByIdApiArg = {
//   /** Task ID to delete */
//   id: number;
// };
// export type User = {
//   id: number;
//   name: string;
//   password: string;
//   email: string;
//   subscribed?: boolean;
//   trial_start_at?: string;
//   trial_end_at?: string;
// };
// export type Project = {
//   id: number;
//   title: Blob;
//   color_code?: any;
//   user_id?: number;
// };
// export type Task = {
//   id: number;
//   title: Blob;
//   user_id: number;
//   running?: boolean;
//   startTime?: string;
//   endTime?: string;
//   project_id?: number;
//   duration?: number;
// };
// export const {
//   useGetUsersQuery,
//   usePostUsersMutation,
//   useGetUsersByIdQuery,
//   usePutUsersByIdMutation,
//   useDeleteUsersByIdMutation,
//   useGetProjectsQuery,
//   usePostProjectsMutation,
//   useGetProjectsByIdQuery,
//   usePutProjectsByIdMutation,
//   useDeleteProjectsByIdMutation,
//   useGetTasksQuery,
//   usePostTasksMutation,
//   useGetTasksByIdQuery,
//   usePutTasksByIdMutation,
//   useDeleteTasksByIdMutation,
// } = injectedRtkApi;

export {};
