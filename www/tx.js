/*
    Copyright Bisq 2018
*/
function TransactionController($scope, $http) {
    $scope.transactionInformation;
    $scope.footer = "FOOTER";
    $scope.title = "TITLE";
    $scope.reason = "unknown";

    $scope.createIconPopup = function () {
        $('.iconPopupInit').popover({ trigger: "hover" });
    };

    //Function for creating popup
    $scope.makePopup = function () {
	//Popup for valid/invalid
	$('#validPopup').popover({ trigger: "hover" });
	var navHeight = $('.navbar').height();
	$('.page-container').css('paddingTop', navHeight + 20);
    };

    $scope.getTransactionData = function () {

        // parse tx from url parameters
        var myURLParams = BTCUtils.getQueryStringArgs();
        var file = 'data/json/tx/' + myURLParams['tx'] + '.json';
        // Make the http request and process the result
        $http.get(file, {}).success(function (data, status, headers, config) {
            $scope.transactionInformation = data;
            $scope.setDefaults();
            $scope.setSums();
            $scope.updateSendersList();
            $scope.updateReceiversList();
            $scope.updateReason();
        });
    }

    $scope.setSums = function () {
        $scope.transactionInformation.bsqReceived = $scope.inputsBsqAmountSum();
        $scope.transactionInformation.bsqSent = $scope.outputsBsqAmountSum();
        $scope.transactionInformation.bsqBurnt = $scope.transactionInformation.burntFee;
        $scope.transactionInformation.bsqIssued = $scope.issued();
    }

    $scope.inputsBsqAmountSum = function () {
        var length = $scope.transactionInformation.inputs.length;
        var sum = 0;
        for (var i = 0; i < length; i++) {
            if ($scope.transactionInformation.inputs[i].isVerified == true)
                sum += parseFloat($scope.transactionInformation.inputs[i].bsqAmount);
        }
        return sum;
    }

    $scope.outputsBsqAmountSum = function () {
        var length = $scope.transactionInformation.outputs.length;
        var sum = 0;
        for (var i = 0; i < length; i++) {
            if ($scope.transactionInformation.outputs[i].isVerified == true)
                sum += parseFloat($scope.transactionInformation.outputs[i].bsqAmount);
        }
        return sum;
    }

    $scope.issued = function () {
        var length = $scope.transactionInformation.outputs.length;
        var sum = 0;
        for (var i = 0; i < length; i++) {
            if ($scope.transactionInformation.outputs[i].isVerified == true &&
                $scope.transactionInformation.outputs[i].txOutputType == "ISSUANCE_CANDIDATE_OUTPUT")
                sum += parseFloat($scope.transactionInformation.outputs[i].bsqAmount);
        }
        return sum;
    }

    $scope.updateSendersList = function () {
        $scope.transactionInformation.bsqInputsList = [];
        var length = $scope.transactionInformation.inputs.length;
        var j = 0;
        for (var i = 0; i < length; i++) {
            if ($scope.transactionInformation.inputs[i].isVerified == true) {
                $scope.transactionInformation.bsqInputsList[j] = $scope.transactionInformation.inputs[i];
                j+=1;
            }
        }
    }

    $scope.updateReceiversList = function () {
        $scope.transactionInformation.bsqOutputsList = [];
        var length = $scope.transactionInformation.outputs.length;
        var j = 0;
        for (var i = 0; i < length; i++) {
            if ($scope.transactionInformation.outputs[i].isVerified == true &&
                $scope.transactionInformation.outputs[i].opReturn == null) {
                $scope.transactionInformation.bsqOutputsList[j] = $scope.transactionInformation.outputs[i];
                j+=1;
            }
        }
    }

    $scope.setDefaults = function() {
        if ($scope.transactionInformation.isVerified == true) {
                $scope.transactionInformation.invalid = false;
        } else {
                $scope.transactionInformation.invalid = true;
        }

     /*   if ($scope.transactionInformation.txType == "GENESIS") {
                $scope.transactionInformation.icon = "genesis";
                $scope.transactionInformation.color = "bgc-new";
        } else {
               if ($scope.transactionInformation.txType == "TRANSFER_BSQ") {
                    $scope.transactionInformation.icon = "simplesend";
                    $scope.transactionInformation.color = "bgc-new";
               } else {
                    $scope.transactionInformation.icon = "simplesend";
                    $scope.transactionInformation.color = "bgc-default";
               }
        }*/
    }


    $scope.updateReason = function () {
        if (!angular.isArray($scope.transactionInformation.invalid)) return;
        if ($scope.transactionInformation.invalid.length < 2) return;
        $scope.reason = $scope.transactionInformation.invalid[1];
    }
}
