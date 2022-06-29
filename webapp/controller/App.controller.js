sap.ui.define([
    "dasa/custom/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("dasa.custom.controller.App", {
        onInit: function () {
            let oViewModel,
                fnSetAppNotBusy,
                fnLoadEmployeeData,
                iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

            oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });

            this.setModel(oViewModel, "appView");

            fnLoadEmployeeData = function () {
                this.getOwnerComponent().pCurrentEmployee = new Promise(function (resolve, reject) {
                    let oEmployeeModel = new JSONModel({});
                    this.setModel(oEmployeeModel, 'loggedEmployee');

                    let oDataModel = this.getModel();
                    oDataModel.read("/EMPREGADO('99999999')", {
                        success: function (oData) {
                            oEmployeeModel.setData(oData);
                            sap.ui.getCore().byId('Name').setText(oData.Cname);
                            resolve(oData);
                        },
                        error: function (oError) {
                            reject(oError)
                        }
                    });
                }.bind(this)).finally(fnSetAppNotBusy);
            }.bind(this);

            fnSetAppNotBusy = function () {
                oViewModel.setProperty("/busy", false);
                oViewModel.setProperty("/delay", iOriginalBusyDelay);
            };

            this.getOwnerComponent().getModel().metadataLoaded()
                .then(fnLoadEmployeeData);

            // apply content density mode to root view
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
        }
    });
});