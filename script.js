var db = openDatabase("todolistDB", "1.0", "todolistDB", "7 * 512 * 1024");

db.transaction(function (tx) {
	console.log("Creating database...");
	tx.executeSql('CREATE TABLE IF NOT EXISTS todolist (id integer primary key autoincrement, task_name text, start_date text, end_date text, description text, priority text, done integer)');
	console.log("Database created");
});

function add(tn, sd, ed, desc, prio, d) {
	db.transaction(function (tx) {
		console.log("Adding data...");
		tx.executeSql('INSERT INTO todolist (task_name, start_date, end_date, description, priority, done) VALUES (?, ?, ?, ?, ?, ?)', [tn, sd, ed, desc, prio, d], 
		function (tx, result) {
          console.log("Query Success");
			location.reload();
      },
      function (tx, error) {
          console.log("Query Error: " + error.message);
      });
	},
	function (error) {
		console.log("Transaction Error: " + error.message);
	},
	function () {
		console.log("Transaction Success");
	});
}

function remove(id) {
	db.transaction(function (tx) {
		tx.executeSql('DELETE FROM todolist WHERE id = ?', [id],
		function (tx, result) {
        console.log("Query Success");
			location.reload();
      },
      function (tx, error) {
          console.log("Query Error: " + error.message);
      });
	},
	function (error) {
		console.log("Transaction Error: " + error.message);
	},
	function () {
		console.log("Transaction Success");
	});
}

function update(id, tn, sd, ed, desc, prio, d) {
	db.transaction(function (tx) {
		tx.executeSql('UPDATE todolist SET task_name = ?, start_date = ?, end_date = ?, description = ?, priority = ?, done = ? WHERE id = ?', [tn, sd, ed, desc, prio, d, id],
		function (tx, result) {
      console.log("Query Success");
      location.reload();
    },
    function (tx, error) {
        console.log("Query Error: " + error.message);
    });
	},
	function (error) {
		console.log("Transaction Error: " + error.message);
	},
	function () {
		console.log("Transaction Success");
	});
}

function update2(id, d) {
	db.transaction(function (tx) {
		tx.executeSql('UPDATE todolist SET done = ? WHERE id = ?', [d, id],
		function (tx, result) {
      console.log("Query Success");
      location.reload();
    },
    function (tx, error) {
        console.log("Query Error: " + error.message);
    });
	},
	function (error) {
		console.log("Transaction Error: " + error.message);
	},
	function () {
		console.log("Transaction Success");
	});
}

function read(id) {
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM todolist WHERE id = ?', [id], function(tx, results) {
			var i = 0;
			var id = results.rows.item(i)["id"];
			var tn = results.rows.item(i)["task_name"];
			var sd = results.rows.item(i)["start_date"];
			var ed = results.rows.item(i)["end_date"];
			var desc = results.rows.item(i)["description"];
			var prio = results.rows.item(i)["priority"];
			var d = results.rows.item(i)["done"];

			document.getElementById("editTask").innerHTML =
			'<div class="form-group">' +
				'<label class="sr-only" for="name"> Task Name: </label>' +
				'<input id="id" type="hidden" value="'+ id +'">' +
				'<input type="text" class="form-control" id="name" value="'+ tn +'">' +
			'</div>' +

			'<div class="form-group">' +
				'<div class="input-group date">' +
					'<input type="date" class="form-control" id="start" value="'+ sd +'">' +
					'<span class="input-group-addon">' +
					'<span class="glyphicon glyphicon-calendar"></span>' +
						'Start date' +
					'</span>' +
				'</div>' +
			'</div>' +
		
			'<div class="form-group">' +
				'<div class="input-group date">' +
					'<input type="date" class="form-control" id="end" value="'+ ed +'">' +
					'<span class="input-group-addon">' +
						'<span class="glyphicon glyphicon-calendar"></span>' +
						'End date &nbsp' +
					'</span>' +
				'</div>' +
			'</div>' +

			'</div>' +
			
			'<div class="form-group">' +
				'<label for="desc"> Description </label>' +
				'<textarea class="form-control" rows="4" id="desc">' + desc + '</textarea>' +
			'</div>' +
			
			'<div class="form-group">' +
				'<div class="input-group">' +
					'<span class="input-group-addon">' +
						'<label for="prio"> Priority </label>' +
					'</span>' +
					'<select class="form-control" id="prio">' +
						'<option disable selected> Select Priority </option>' +
						'<option style="color: #ED4337;">High</option>' +
						'<option style="color: #FFFC7F;">Medium</option>' +
						'<option style="color: #C0D890;">Low</option>' +
					'</select>' +
				'</div>' +
			'</div>' +
			
			'<input class="btn add2" type="submit" value="Edit Task">';
		});
	});
}

function readAll() {
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM todolist', [], function(tx, results) {
			
			var len = results.rows.length;
			for (var i = 0; i < len; i++) {

				var id = results.rows.item(i)["id"];
				var tn = results.rows.item(i)["task_name"];
				var sd = results.rows.item(i)["start_date"];
				var ed = results.rows.item(i)["end_date"];
				var desc = results.rows.item(i)["description"];
				var prio = results.rows.item(i)["priority"];
				var d = results.rows.item(i)["done"];
				if (d == 0) {
					var dx = 1;	
				} else {
					var dx = 0;
				}
				

				document.getElementById("list").innerHTML += 
					'<div class="col-lg-4 col-sm-6 thumbnail" id="item' + id + '">' +
						'<div class="container-fluid box">' +
							
							'<button type="button" class="close" onclick="remove('+ id +')">&times;</button>' +
							'<button type="button" class="close pencil" data-toggle="modal" data-target="#edit" onclick="read('+ id +')">' +
								'<span class="glyphicon glyphicon-pencil"> </span>' +
							'</button>' +
							'<form class="form-inline">' +
								'<div class="top-box">' +
									'<label><input type="checkbox" id="checkbox" onclick="update2('+id+', '+dx+')"> <b>' + tn + ' </b> </label>' +
								'</div>' +
							'</form>' +
						
						'</div>' +
						
						'<div class="row container-fluid">' +
							'<div class="col-sm-8">' +
								'<span class="date-box">' +
									'<span class="glyphicon glyphicon-calendar"></span>' +
									'Start date' +
								'</span>' +
								sd +
								'<br> <br>' +
								'<span class="date-box">' +
									'<span class="glyphicon glyphicon-calendar"></span>' +
									'End date &nbsp' +
								'</span>' +
								ed +
							'</div>' +
						'</div>' +
						'<div class="container-fluid text-justify desc">' +
							desc +
						'</div>' +

					'</div>';

				if (prio == "High") {
					document.querySelector('#item'+ id + ' .box').className += " high";
				} else if (prio == "Medium") {
					document.querySelector('#item'+ id + ' .box').className += " medium";
				} else {
					document.querySelector('#item'+ id + ' .box').className += " low";
				}

				if (d == 1) {
					document.querySelector('#item'+ id + ' #checkbox').checked == true;
				} else {
					document.querySelector('#item'+ id + ' #checkbox').checked == false;
				}
			}

		});
	});
};

$(document).ready(function(){
	readAll();

	$("#addTask").submit(function() {
		var tn = $("#name").val();
		var sd = $("#start").val();
		var ed = $("#end").val();
		var desc = $("#desc").val();
		var prio = $("#prio").val();
		var d = 0;

		add(tn, sd, ed, desc, prio, d);
		return false;
	});

	$("#editTask").submit(function() {
		var id = $("#id").val();
		var tn = $("#name").val();
		var sd = $("#start").val();
		var ed = $("#end").val();
		var desc = $("#desc").val();
		var prio = $("#prio").val();
		var d = 0;
		update(id, tn, sd, ed, desc, prio, d);
		return false;
	});
});