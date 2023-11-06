document.addEventListener('DOMContentLoaded', function () { 

  // cargar datos que vienen del php
  fetch('database/conect_db.php') 
  .then(response => response.json())
  .then(data => {


    function createTable(dataArray, tableName) {
      const container = document.getElementById('tablesContainer');
      
      const divtable = document.createElement('div');
      divtable.className = 'table-responsive scrollbar mb-3 p-2 card shadow table-responsive'
      
      const table = document.createElement('table');
      table.className = 'table table-hover table-bordered table-striped overflow-hidden fs--1'

      const thead = document.createElement('thead');
      thead.className = "bg-200"
      const tbody = document.createElement('tbody');

      const columns = dataArray.map(obj => Object.keys(obj))[0];

      const theadRow = thead.insertRow();
      columns.forEach(column => {
          const th = document.createElement('th');
          th.textContent = column;
          theadRow.appendChild(th);
      });

      dataArray.forEach(item => {
          const row = tbody.insertRow();
          columns.forEach(column => {
              const cell = row.insertCell();
              cell.textContent = item[column];
          });
      });

      table.appendChild(thead);
      table.appendChild(tbody);

      let titulo_tabla = document.createElement('h2');
      titulo_tabla.classList = 'mb-2 p-2';
      titulo_tabla.textContent = tableName;
      divtable.appendChild(titulo_tabla);

      divtable.appendChild(table);
      container.appendChild(divtable);
    }

    for (var base in data) {
      const nombbase = base;

      createTable(data[nombbase], base)

    }

  })

})