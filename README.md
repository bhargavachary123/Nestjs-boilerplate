Starting from the base project https://github.com/nestjs/nest/tree/master/sample/05-sql-typeorm

### Features

- [x] Database. Support [TypeORM](https://www.npmjs.com/package/typeorm) and [Mysql](https://www.npmjs.com/package/mongoose).
- [x] Seeding ([typeorm-seeding](https://www.npmjs.com/package/typeorm-seeding)).
- [x] Config Service ([@nestjs/config](https://www.npmjs.com/package/@nestjs/config)).
- [x] Mailing ([nodemailer](https://www.npmjs.com/package/nodemailer)).
- [x] Jwt Authentication.
- [x] Cacheing Data using Redis.
- [x] Events and CornJobs.
- [x] Daily Rotate Log Files.
- [x] Admin and User roles.
- [x] Allow specific Origns.
- [x] File uploads. Support local.
- [x] Swagger.
- [x] Docker.

### Installation
NestJS Boilerplate supports [TypeORM]and [Mysql].

1. Clone repository
   `git clone https://github.com/bhargavachary123/Nestjs-boilerplate.git `

2. Config the the `.env` file with the help of `examole.env` file

3. Install dependency 
`npm install --legacy-peer-deps`

4. Config seeds
    `npm run seed:config` 

5.Run seeds
    `npm run seed:run`

*copy the username and password for login which has been generated by seeder.*

6. Run app in dev mode Or watch mode

`npm run start:dev`

project will run on localhost:8000