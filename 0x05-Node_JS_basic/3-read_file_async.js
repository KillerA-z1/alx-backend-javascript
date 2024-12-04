const fs = require('fs');

module.exports = function countStudents(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
        return;
      }

      const lines = data.split('\n').filter((line) => line.trim() !== '');
      const header = lines[0].split(',');
      const idxFn = header.indexOf('firstname');
      const idxFd = header.indexOf('field');

      if (idxFn === -1 || idxFd === -1) {
        reject(new Error('Invalid CSV format'));
        return;
      }

      const fields = {};
      const students = {};

      lines.slice(1).forEach((line) => {
        const list = line.split(',');
        if (list.length === header.length) {
          const field = list[idxFd];
          const firstname = list[idxFn];

          if (!fields[field]) fields[field] = 0;
          fields[field] += 1;

          if (!students[field]) students[field] = '';
          students[field] += students[field] ? `, ${firstname}` : firstname;
        }
      });

      console.log(`Number of students: ${lines.length - 1}`);
      for (const key in fields) {
        if (Object.prototype.hasOwnProperty.call(fields, key)) {
          const element = fields[key];
          console.log(`Number of students in ${key}: ${element}. List: ${students[key]}`);
        }
      }
      resolve();
    });
  });
};
