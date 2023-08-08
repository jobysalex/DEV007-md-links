#!/usr/bin/env node
const cliPage = require('./cli.js');
const colors = require('colors'); 
const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    if (!path) {
      reject('Ingrese la ruta');
    } else {
      const absolutePath = cliPage.convertToAbsolutePath(path);
      const validPath = cliPage.validatePath(absolutePath);
      if (validPath) {
      let getFiles = [];

      if (cliPage.isADirectory(absolutePath)) {
        // Si es un directorio, obtenemos todos los archivos .md dentro del directorio
        getFiles = cliPage.searchPathMd(absolutePath);
      } else if (cliPage.isMdFile(absolutePath)) {
        // Si es un archivo .md, lo agregamos directamente a la lista de archivos
        getFiles.push(absolutePath);
      } else {
        // Si no es ni un archivo ni un directorio válido, rechazamos la promesa
        reject('La ruta no es un archivo ni un directorio válido');
      }

      const linksArray = [];

      // Recorrer los archivos .md y extraer los enlaces
      getFiles.forEach((file) => {
        const linksInFile = cliPage.extractLinksMd(file);
        linksArray.push(...linksInFile);
      });

      if (options.validate && options.stats) {
        const validatePromises = linksArray.map((link) => {
          return cliPage.checkLink(link).then((validatedLink) => {
            return {
              ...validatedLink,
              file: link.file,
            };
          });
        });

        Promise.all(validatePromises)
          .then((validatedLinks) => {
            const stats = {
              total: linksArray.length,
              unique: cliPage.uniqueLinks(linksArray),
              broken: cliPage.brokenLinks(validatedLinks),
            };
            resolve({
              stats: stats,
              links: validatedLinks,
            });
          })
          .catch((error) => {
            reject(error);
          });
        } else if (options.validate) {
          const validatePromises = linksArray.map((link) => {
            return cliPage.checkLink(link).then((validatedLink) => {
              return {
                ...validatedLink,
                file: link.file,
              };
            });
          });
    
        Promise.all(validatePromises)
          .then((validatedLinks) => {
            resolve(validatedLinks);
          })
          .catch((error) => {
            reject(error);
          });
        } else if (options.stats) {
          const stats = {
            total: linksArray.length,
            unique: cliPage.uniqueLinks(linksArray),
          };
          resolve({
            stats: stats,
            links: linksArray,
          });
        } else {
          resolve(linksArray);
      }
    } else {
      reject('La ruta no existe');
    }
  }
});
};

const [, , ...args] = process.argv;
const options = {
validate: args.includes('--validate'),
stats: args.includes('--stats'),
};

mdLinks(args[0], options)
.then((result) => {
  console.log(colors.magenta(result));
})
.catch((error) => {
  console.error(colors.red(error));
});

module.exports = {
  mdLinks
};
