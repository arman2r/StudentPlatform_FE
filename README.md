# StudentPlatform

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.13 with Node v22.15.0.

## Este proyecto soporta Docker
- Recuerda ejecutar Docker desktop para evitar inconvenientes con los comando a continuación.
- para evitar posibles problemas con dependencias puedes clonar el proyecto y ejecutar los comando
```bash
docker build -t student-frontend .
```
- una vez termine los procesos puedes ejecutar el comando:
```bash
docker run -d -p 4300:80 student-frontend
```
- para que ejecute la imagen bajo el puerto 4300
- Si ejecutaste el backend con Docker, puedes interactuar registrando una cuenta tipo estudiante o loguearte con una cuenta ya existente de prueba
- Para ingresar como estudiante:
- leonardo@gmail.com
- Leonardo123--
- para ingresar como profesor:
- ** http://localhost:4300/login-teacher
- julian@gmail.com
- Julian123--


## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
