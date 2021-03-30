# Lambda para exponer las estadisticas del proceso de validar si un ADN es mutante o no

Lambda que expone un Rest API para consultar las estadisticas del proceso de verificación de ADN

## Precondiciones

- NodeJS 12 o superior
- npm 6 o superior
- terraform 0.14.9 o superior
- Prettier vscode plugin [https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode] o como dependencia de npm [https://prettier.io/docs/en/install.html]

## Inicializar proyecto

```bash
npm install
```

Este comando descarga las dependencias y dejan el proyecto listo para ser transpilado

## Transpilar

```bash
npm run build
```

Transpila el código que este en typescript a javascript, generando los nuevos archivos en el directorio `dist`

## Calidad de Código

En el proyecto cuenta con 2 tipos de pruebas

### Pruebas unitartias

Pruebas de cada uno de los componentes por separado, haciendo mocks de sus dependencias con el fin de validar el funcionamiento de cada componente

correr pruebas unitarias:

```bash
npm run unit:test
```

### Pruebas de Integración

Pruebas con los componentes desarrollados interacturando entre si, se hace mock de los terceros a los que se consume o se envia información, en este caso se realiza mock de la BD

```bash
npm run test:integ
```

### Cobertura

```bash
npm run test:coverage
```

Ejecuta las pruebas unitarias y genera el reporte de cobertura en el directorio `.nyc_coverage` en formato `lcov` (disponible para cargar a un sistema como el sonar), para ver dicho reporte en formato HTML, favor abrir el archivo:

```bash
.nyc_coverage/lcov-report/index.html
```

## Crear paquete para cargar la lambda en AWS

```bash
npm run pack
```

Construye un paquete ZIP con los archivos necesarios para correr la lambda en AWS `meli-magneto-api.zip`

## Despliegue

Para el despliegue de la lambda y sus componentes adicionales se usa `terraform`, el código IAC esta almacenado en el directorio `terraform` que esta ubicado en la raíz del proyecto
**Nota:** La version de `terraform` usada es **v0.14.9**

### Plan de despliegue en ambiente dev

```bash
npm run tf:dev:plan
```

### Despliegue en ambiente dev

```bash
npm run tf:dev:apply
```

## Consumo del RestAPI

```bash
curl --location --request GET 'https://70ebveca22.execute-api.us-east-1.amazonaws.com/dev/magneto/api/v1/stats' \
--header 'x-api-key: <Aqui el Api Key>'
```

_Nota:_ la Api Key para consumir el endpoint será enviada a los interesados
