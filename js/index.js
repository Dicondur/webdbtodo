angular.module("myApp", []).controller("myCtrl", function ($scope) {
    $scope.model = { "contacts": [] };
    var dbSize = 5 * 1024 * 1024; // 5MB
    $scope.webdb = {};

    $scope.addContact = function () {
        //$scope.model.contacts.push({ "name": $scope.contact_to_add })

        var db = $scope.webdb.db;
        db.transaction(function (tx) {
            var dToday = new Date();
            tx.executeSql("INSERT INTO contact(ID, name, email, phone, dateAdded) VALUES(?, ?, ?, ?, ?) ",
                [uuid.v4(), $scope.name_to_add, $scope.email_to_add, $scope.phone_to_add, dToday],
                function () {
                    $scope.name_to_add = "";
                    $scope.email_to_add = "";
                    $scope.phone_to_add = "";
                    $scope.readContacts();
                },
                function () {
                    console.log("failed");
                }
            );
        });

    }
    $scope.readContacts = function () {
        var db = $scope.webdb.db;
        db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM contact", [],
                function (tx, rs) {
                    $scope.model.contacts = [];
                    for (var i = 0; i < rs.rows.length; i++) {
                        $scope.model.contacts.push({
                            "name": rs.rows.item(i).name,
                            "email": rs.rows.item(i).email,
                            "phone": rs.rows.item(i).phone,
                            "ID": rs.rows.item(i).ID
                        });
                    }
                    $scope.$apply();
                },
                function () {
                    console.log("failed");
                });
        });
    }
    $scope.deleteContact = function (sId) {
        var db = $scope.webdb.db;
        db.transaction(function (tx) {
            tx.executeSql("DELETE FROM contact WHERE ID = ?", [sId],
                function () {
                    console.log("deleted");
                    $scope.readContacts();
                },
                function () {
                    console.log("failed to delete");
                }
            );
        });
    }
    $scope.webdb.db = openDatabase("Contact", "1", "Contact manager", dbSize);
    var db = $scope.webdb.db;
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS " +
            "contact(ID TEXT PRIMARY KEY, name TEXT, email TEXT, phone TEXT, dateAdded DATETIME)", [],
            function () {
                console.log("success");
                $scope.readContacts();
            },
            function () { console.log("failure") }
        );
    });

});

