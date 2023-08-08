const { mdLinks } = require("../index.js");
const { 
  validatePath,
  convertToAbsolutePath, 
  isAFile,
  isADirectory, 
  readDirectory,
  extractLinksMd,
  isMdFile,
  checkLink,
  searchPathMd,
  uniqueLinks,
  brokenLinks
} = require('../cli.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const colors = require('colors');

let correctRelativePath = '.\\test-file\\otro.md';
let correctAbsolutePath = path.resolve(correctRelativePath);
let noMdFile = 'C:\\Users\\jobys\\OneDrive\\Documentos\\Laboratoria\\DEV007-md-links\\test-file\\funciones.js';
let directoryExist = 'test-file';

describe("mdLinks", () => {
  it("Deberia indicar que es una funcion", () => {
    expect(typeof mdLinks).toBe("function");
  });
  it('Debería rechazar la promesa si no se proporciona la ruta', () => {
    return expect(mdLinks()).rejects.toEqual('Ingrese la ruta');
  });
  it('debería retornar un array de objetos con información de los links encontrados en el archivo .md', () => {
    const mdFilePath = 'C:\\Users\\jobys\\OneDrive\\Documentos\\Laboratoria\\DEV007-md-links\\test-file\\otro.md';
    const options = { validate: false, stats: false }; // No se necesita validación ni estadísticas
    const expectedLinks = [
      {
        "file": "C:\\Users\\jobys\\OneDrive\\Documentos\\Laboratoria\\DEV007-md-links\\test-file\\otro.md",
        "href": "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise*",
        "text": "Promise - MDN",
      },
      {
        "file": "C:\\Users\\jobys\\OneDrive\\Documentos\\Laboratoria\\DEV007-md-links\\test-file\\otro.md",
        "href": "https://nodejs.org/docs/latest/api/modules.html",
        "text": "Modules: CommonJS modules - Node.js Docs",
      },
      {
        "file": "C:\\Users\\jobys\\OneDrive\\Documentos\\Laboratoria\\DEV007-md-links\\test-file\\otro.md",
        "href": "https://nodejs.org/docs/latest/api/modules.html",
        "text": "Modules: CommonJS modules - Node.js Docs",
      },

    ];
    return expect(mdLinks(mdFilePath, options)).resolves.toEqual(expectedLinks);
  });


  it('debería retornar un objeto con estadísticas de los links encontrados en el archivo .md', () => {
    const mdFilePath = 'C:\\Users\\jobys\\OneDrive\\Documentos\\Laboratoria\\DEV007-md-links\\test-file\\otro.md';
    const options = { validate: false, stats: true }; // No validar los links pero mostrar estadísticas
    const expectedStats = { 
      "links": [
             {
               "file": "C:\\Users\\jobys\\OneDrive\\Documentos\\Laboratoria\\DEV007-md-links\\test-file\\otro.md",
               "href": "https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise*",
               "text": "Promise - MDN",
             },
             {
               "file": "C:\\Users\\jobys\\OneDrive\\Documentos\\Laboratoria\\DEV007-md-links\\test-file\\otro.md",
               "href": "https://nodejs.org/docs/latest/api/modules.html",
               "text": "Modules: CommonJS modules - Node.js Docs",
             },
             {
               "file": "C:\\Users\\jobys\\OneDrive\\Documentos\\Laboratoria\\DEV007-md-links\\test-file\\otro.md",
               "href": "https://nodejs.org/docs/latest/api/modules.html",
               "text": "Modules: CommonJS modules - Node.js Docs",
             },
           ],
           "stats": {
                 "total": 3,
                 "unique": 2,
               },
      };
    return expect(mdLinks(mdFilePath, options)).resolves.toEqual(expectedStats);
  });
});

describe('validatePath', () => {
  it('Deberia indicar true si la ruta existe', () => {
    const pathExist = 'C:\Users\jobys\OneDrive\Documentos\Laboratoria\DEV007-md-links\test-file';
    expect(validatePath(correctAbsolutePath)).toBe(true);
  });
  it('Deberia indicar false si la ruta no existe', () => {
    const pathExist = 'prueba.mz';
    expect(validatePath(pathExist)).toBe(false);
  });
});

describe('convertToAbsolutePath', () => {
  it('debería convertir una ruta relativa a absoluta', () => {
    const relativePath = '..\test-file\otro.md';
    const absolutePath = path.resolve(relativePath);
    expect(convertToAbsolutePath(relativePath)).toBe(absolutePath);
  });

  it('debería mantener una ruta absoluta sin cambios', () => {
    const absolutePath = 'C:/Users/jobys/OneDrive/Documentos/Laboratoria/DEV007-md-links/test-file/otro.md';
    expect(convertToAbsolutePath(absolutePath)).toBe(absolutePath);
  });
});

describe('isAFile', () => {
  it('debería retornar true para una ruta válida que corresponde a un archivo', () => {
    const filePath = 'C:\\Users\\jobys\\OneDrive\\Documentos\\Laboratoria\\DEV007-md-links\\test-file\\otro.md';
    expect(isAFile(filePath)).toBe(true);
  });

  it('debería lanzar un error para una ruta inexistente', () => {
    const nonExistentPath = 'C:\Users\jobys\OneDrive\Documentos\Laboratoria\DEV007-md-links\test-file\noexiste';
    expect(() => isAFile(nonExistentPath)).toThrowError();
  });
});

describe('isADirectory', () => {
  it('debería devolver true para un directorio existente', () => {
    expect(isADirectory(directoryExist)).toBe(true);
  });
  it("Valida si la ruta no es un directorio", () => {
    expect(isADirectory(correctAbsolutePath)).toBe(false);
  });
});

describe('readDirectory', () => {
  it('debería retornar un array vacío para un directorio vacío', () => {
    const emptyDirectoryPath = 'C:\\Users\\jobys\\OneDrive\\Documentos\\Laboratoria\\DEV007-md-links\\test-file\\file3';
    const result = readDirectory(emptyDirectoryPath);
    expect(result).toEqual([]);
  });
  it('debería retornar un array con los nombres de los archivos que hay en un directorio', () => {
    const sampleDirectoryPath = 'C:\\Users\\jobys\\OneDrive\\Documentos\\Laboratoria\\DEV007-md-links\\test-file';
    const expectedFiles = ['file2', 'file3', 'texto2.txt', 'otro2.md','funciones.js'];
    const result = readDirectory(sampleDirectoryPath);
    expect(result).toEqual(expect.arrayContaining(expectedFiles));
  });
});

describe("extractLinksMd, Validamos extension .md de la ruta", () => {
  it("Valida que la ruta es .md y devuelve un array", () => {
    expect(typeof extractLinksMd(correctAbsolutePath)).toEqual('object');
  });
  it("Valida que la ruta no es .md y devuelve array vacio", () => {
    expect(extractLinksMd(noMdFile)).toEqual([]);
  });
});

describe('isMdFile', () => {
  it('debería devolver true si la ruta tiene extensión .md', () => {
    expect(isMdFile(correctAbsolutePath)).toBe(true);
  });
  it('debería devolver false para una ruta sin extensión .md', () => {
    expect(isMdFile(noMdFile)).toBe(false);
  });
});

describe('uniqueLinks', () => {
  it('debería devolver 0 para un array vacío', () => {
    const links = [];
    const resultado = uniqueLinks(links);
    expect(resultado).toBe(0);
  });
  it('debería devolver la cantidad de enlaces únicos en un array con enlaces repetidos', () => {
    const links = [
      { href: 'https://www.example.com' },
      { href: 'https://www.example2.com' },
      { href: 'https://www.example.com' },
      { href: 'https://www.example3.com' },
      { href: 'https://www.example.com' },
    ];
    const resultado = uniqueLinks(links);
    expect(resultado).toBe(3); // Hay 3 enlaces únicos en el array
  });
  it('debería devolver la cantidad de enlaces únicos en un array sin enlaces repetidos', () => {
    const links = [
      { href: 'https://www.example.com' },
      { href: 'https://www.example2.com' },
      { href: 'https://www.example3.com' },
    ];
    const resultado = uniqueLinks(links);
    expect(resultado).toBe(3); // Todos los enlaces son únicos
  });
});

describe('brokenLinks', () => {
  it('debería devolver 0 para un array vacío', () => {
    const links = [];
    const resultado = brokenLinks(links);
    expect(resultado).toBe(0);
  });
  it('debería devolver la cantidad de enlaces rotos en un array con enlaces válidos e inválidos', () => {
    const links = [
      { href: 'https://www.example.com', status: 200, ok: 'OK' },
      { href: 'https://www.example2.com', status: 404, ok: 'FAIL' },
      { href: 'https://www.example3.com', status: 500, ok: 'FAIL' },
      { href: 'https://www.example4.com', status: 200, ok: 'OK' },
    ];
    const resultado = brokenLinks(links);
    expect(resultado).toBe(2); // Hay 2 enlaces rotos en el array
  });
  it('debería devolver 0 enlaces rotos para un array con enlaces válidos únicamente', () => {
    const links = [
      { href: 'https://www.example.com', status: 200, ok: 'OK' },
      { href: 'https://www.example4.com', status: 200, ok: 'OK' },
      { href: 'https://www.example5.com', status: 200, ok: 'OK' },
    ];
    const resultado = brokenLinks(links);
    expect(resultado).toBe(0); // No hay enlaces rotos en el array
  });
});

jest.mock('axios'); // Mockear la dependencia axios

describe('checkLink', () => {
  it('debería devolver un objeto con el status "OK" para una respuesta exitosa (status 200)', () => {
    const link = {
      href: 'https://ejemplo.com',
      text: 'Enlace de ejemplo',
      file: 'ruta/del/archivo.md',
    };

    // Simulamos una respuesta exitosa con status 200
    axios.get.mockResolvedValue({ status: 200 });

    return checkLink(link).then((result) => {
      expect(result).toEqual({
        ...link,
        status: 200,
        ok: 'OK',
      });
    });
  });

  it('debería devolver un objeto con el status "FAIL" para una respuesta con error (status 404)', () => {
    const link = {
      href: 'https://ejemplo.com/no-existe',
      text: 'Enlace inexistente',
      file: 'ruta/del/archivo.md',
    };

    // Simulamos una respuesta con error con status 404
    axios.get.mockRejectedValue({ response: { status: 404 } });

    return checkLink(link).then((result) => {
      expect(result).toEqual({
        ...link,
        status: 404,
        ok: 'FAIL',
      });
    });
  });
}); 

describe('searchPathMd', () => {
  it('debería devolver una lista vacía si no hay archivos .md en el directorio', () => {
    const ruta = 'C:\\Users\\jobys\\OneDrive\\Documentos\\Laboratoria\\DEV007-md-links\\test-file\\file2';
    const resultado = searchPathMd(ruta);
    expect(resultado).toEqual([ ]);
  });
  it('debería devolver una lista con las rutas de los archivos .md en el directorio', () => {
    const ruta = 'test-file';
    const expectedFiles = [
      "test-file\\otro.md",
      "test-file\\otro2.md",
    ];
    const resultado = searchPathMd(ruta);
    expect(resultado).toEqual(expectedFiles);
  });
});
