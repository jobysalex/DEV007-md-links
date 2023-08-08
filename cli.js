const fs = require('fs');
const path = require('path');
const axios = require('axios');

//  Función que valida la ruta
const validatePath = (paths) => fs.existsSync(paths);

//  Función que valida la ruta, si es Relativa lo convierte en Absoluta
const convertToAbsolutePath = (paths) => { 
  if (!path.isAbsolute(paths)) { 
    paths = path.resolve(paths);
  }
  return paths;
};

//  Función que mira si es un archivo
const isAFile = (paths) => fs.statSync(paths).isFile();

//  Función que mira si es un directorio
const isADirectory = (paths) => fs.statSync(paths).isDirectory();

//  Función que lee el directorio
const readDirectory = (paths) => fs.readdirSync(paths);

//  Función que mira si es un archivo md
const isMdFile = (paths) => path.extname(paths) === ".md";

// Función que lee un archivo .md y extrae los links
const extractLinksMd = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const linksArray = [];
  let match;

  while ((match = linkRegex.exec(fileContent)) !== null) {
    const linkProperties = {
      href: match[2],
      text: match[1],
      file: filePath,
    };
    linksArray.push(linkProperties);
  }

  return linksArray;
};

// Función para verificar la validez de un link
const checkLink = (link) => {
  return axios
    .get(link.href)
    .then((response) => {
      if (response.status >= 200 && response.status < 400) {
        return {
          ...link,
          status: response.status,
          ok: 'OK',
        };
      } else {
        return {
          ...link,
          status: response.status,
          ok: 'FAIL',
        };
      }
    })
    .catch((error) => {
      return {
        ...link,
        status: error.response.status,
        ok: 'FAIL',
      };
    });
};

// Función para buscar archivos .md con su ruta para poder guardarlos en un array
const searchPathMd = (ruta) => {
  const archivosMarkdown = [];

  // Función recursiva para revisar los directorios internos
  const revisarDirectorio = (rutaActual) => {
    const archivos = fs.readdirSync(rutaActual);

    archivos.forEach((archivo) => {
      const rutaArchivo = path.join(rutaActual, archivo);
      const stats = fs.statSync(rutaArchivo);

      if (stats.isDirectory()) {
        revisarDirectorio(rutaArchivo);
      } else if (path.extname(archivo) === '.md') {
        archivosMarkdown.push(rutaArchivo);
      }
    });
  };

  revisarDirectorio(ruta);

  return archivosMarkdown;
};

// Función para contar la cantidad de links únicos
const uniqueLinks = (links) => {
  const unique = new Set(links.map((elem) => elem.href));
  return unique.size;
};

// Función para contar la cantidad de links rotos (broken links)
const brokenLinks = (links) => {
  const broken = links.filter((elem) => elem.status >= 400 || elem.ok === 'FAIL');
  return broken.length;
};

module.exports = {
  validatePath,
  convertToAbsolutePath,
  isAFile,
  isADirectory,
  readDirectory,
  isMdFile,
  extractLinksMd,
  checkLink,
  uniqueLinks,
  brokenLinks,
  searchPathMd,
};