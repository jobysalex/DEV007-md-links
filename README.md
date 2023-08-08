![](./img/mdLinksGia.png).
#  Markdown Links

## Índice

* [1. Preámbulo](#1-preámbulo)
* [2. Proceso de desarrollo](#2-proceso-de-desarrollo)
* [3. Resumen del proyecto](#3-Resumen-del-proyecto)
* [4. Que es `mdLinks(path, options)](#4-Que-es-mdLinks)
* [5. Modo de uso](#5-Modo-de-uso)
* [6. Tutoriales y Recursos](#6-Tutoriales-y-Recursos)
* [7. Archivos del proyecto](#7-Archivos-del-proyecto)

***

## 1. Preámbulo

[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado
ligero muy popular entre developers. Es usado en muchísimas plataformas que
manejan texto plano (GitHub, foros, blogs, ...) y es muy común
encontrar varios archivos en ese formato en cualquier tipo de repositorio
(empezando por el tradicional `README.md`).

Estos archivos `Markdown` normalmente contienen _links_ (vínculos/ligas) que
muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de
la información que se quiere compartir.

Entonces esta herramienta, creada con Node.js, lee y analiza archivos en formato Markdown, 
para verificar los links que contengan y reportar algunas estadísticas.

![md-links](https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg)

## 2. Proceso de desarrollo:

Como punto de partida para la ejecución de este proyecto, se elaboró la lógica y se diseñó un diagrama de 
flujo para organizar el proceso.

En este proyecto use la herramienta de planificación y organización de GitHub llamada **Github Projects**.

Utilice para el desarrollo de este proyecto: `CommonJS Modules`, es decir, **require/module.exports**

## 3. Resumen del proyecto

En este proyecto se ha desarrollado un programa que se ejecutará en la terminal o consola. 
Para utilizar este, se puede con comandos específicos que he diseñado y programado 
en la misma línea de comandos.

Estos comandos nos permitirán acceder a los enlaces presentes en archivos o directorios, osea lee y 
analiza archivos en formato Markdown, para obtener el total de enlaces, identificar enlaces únicos y 
encontrar enlaces rotos.

## 4. Que es `mdLinks(path, options)`

Esta es una función llamada mdLinks(path, options) que devuelve una promesa, recibiendo dos parámetros: 

**path** que puede ser la ruta absoluta o relativa a un archivo o directorio.
**options** que puede ser: 

**** `--validate` el módulo debe hacer una petición HTTP para averiguar si el link funciona o no y obtendriamos:

Con `validate:false` osea si no lo colocamos tendremos:

    * `href`: URL encontrada.
    * `text`: Texto que aparecía dentro del link (`<a>`).
    * `file`: Ruta del archivo donde se encontró el link.

Con `validate:true` osea si lo colocamos tendremos:

    * `href`: URL encontrada.
    * `text`: Texto que aparecía dentro del link (`<a>`).
    * `file`: Ruta del archivo donde se encontró el link.
    * `status`: Código de respuesta HTTP.
    * `ok`: Mensaje `fail` en caso de fallo u `ok` en caso de éxito.

**** `--stats`: entonces si colocamos --stats la salida será un texto con estadísticas básicas sobre los links asi: 

    `{Total: 3, Unique: 3}`
        * `href`: URL encontrada.
        * `text`: Texto que aparecía dentro del link (`<a>`).
        * `file`: Ruta del archivo donde se encontró el link.

**** `--validate --stats`: entonces si colocamos las dos al tiempo, te agrega el número de links que están 
rotos o no funcionan correctamente, donde:
  Total: seria el número total de links encontrados en el archivo o directorio.
  Unique:  seria el número de links únicos, es decir, aquellos que no se repiten.
  Broken: seria el número de links que están rotos o no funcionan correctamente.
por tanto obtendriamos:

     `{Total: 3, Unique: 3, Broken: 1}`
         * `href`: URL encontrada.
         * `text`: Texto que aparecía dentro del link (`<a>`).
         * `file`: Ruta del archivo donde se encontró el link.
         * `status`: Código de respuesta HTTP.
         * `ok`: Mensaje `fail` en caso de fallo u `ok` en caso de éxito.


## 5. Modo de uso

Debes ingresar la ruta del archivo o directorio de la sigueinte manera:

1. Si ejecutas: **md-links <path>**, el módulo hará una petición HTTP para averiguar si los links funcionan o
no. Nos debe dar:  href,  text,  file; se mostrarán estadísticas que también requieren los resultados de
validación de los links.

2.  Si se usa **md-links <path> --validate** el módulo hará una petición HTTP para averiguar si los links 
funcionan o no. Nos debe dar: href, text, file, status y mensaje OK o FAIL. 

3. Si utilizas el comando **md-links <path> --stats**, recibirás los links y un texto que proporciona
estadísticas básicas sobre los links encontrados en el archivo o directorio especificado. Nos debe dar: href,
text, file, Total y Unique.

4. Si ejecutas el comando **md-links <path> --validate --stats** , se mostrarán: href, text, file, status,  
mensaje OK o FAIL, Total, Unique y Broken

## 6. Tutoriales y Recursos

* [learnyounode](https://github.com/workshopper/learnyounode)
* [how-to-npm](https://github.com/workshopper/how-to-npm)
* [promise-it-wont-hurt](https://github.com/stevekane/promise-it-wont-hurt)
* [Acerca de Node.js - Documentación oficial](https://nodejs.org/es/about/)
* [Node.js file system - Documentación oficial](https://nodejs.org/api/fs.html)
* [Node.js http.get - Documentación oficial](https://nodejs.org/api/http.html#http_http_get_options_callback)
* [Node.js - Wikipedia](https://es.wikipedia.org/wiki/Node.js)
* [What exactly is Node.js? - freeCodeCamp](https://medium.freecodecamp.org/what-exactly-is-node-js-ae36e97449f5)
* [¿Qué es Node.js y para qué sirve? - drauta.com](https://www.drauta.com/que-es-nodejs-y-para-que-sirve)
* [¿Qué es Nodejs? Javascript en el Servidor - Fazt en YouTube](https://www.youtube.com/watch?v=WgSc1nv_4Gw)
* [¿Simplemente qué es Node.js? - IBM Developer Works, 2011](https://www.ibm.com/developerworks/ssa/opensource/library/os-nodejs/index.html)
* [Node.js y npm](https://www.genbeta.com/desarrollo/node-js-y-npm)
* [Asíncronía en js](https://carlosazaustre.es/manejando-la-asincronia-en-javascript)
* [NPM](https://docs.npmjs.com/getting-started/what-is-npm)
* [Publicar packpage](https://docs.npmjs.com/getting-started/publishing-npm-packages)
* [Crear módulos en Node.js](https://docs.npmjs.com/getting-started/publishing-npm-packages)
* [Leer un archivo](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback)
* [Leer un directorio](https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback)
* [Path](https://nodejs.org/api/path.html)
* [Linea de comando CLI](https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e)

## 7. Archivos del proyecto

* `README.md` con descripción del módulo, instrucciones de instalación/uso,
  documentación del API y ejemplos. Todo lo relevante para que cualquier
  developer que quiera usar tu librería pueda hacerlo sin inconvenientes.
* `index.js`: Desde este archivo debes exportar **una** función (`mdLinks`).
* `cli.js`: En este archivo tendre las funciones.
* `test-file`: Es un directorio con carpetas y archivos de prueba.
* `package.json` con nombre, versión, descripción, autores, licencia,
  dependencias, scripts (pretest, test, ...), main, bin
* `.editorconfig` con configuración para editores de texto. Este archivo no se
  debe cambiar.
* `.eslintrc` con configuración para linter. Este archivo contiene una
  configuración básica para ESLint, si deseas agregar reglas adicionales
  como Airbnb deberás modificar este archivo.
* `.gitignore` para ignorar `node_modules` u otras carpetas que no deban
  incluirse en control de versiones (`git`).
* `test/md-links.spec.js` debe contener los tests unitarios para la función
  `mdLinks()`. Tu implementación debe pasar estos tests.

## 8. Anexos

### A. Diagrama de Flujo
![mdLinks](./imagesReadme/diagrama-de.Flujo.png)

### Autora: YOHANA ALEXANDRA BECERRA BECERRA