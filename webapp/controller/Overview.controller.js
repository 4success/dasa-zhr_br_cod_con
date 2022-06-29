sap.ui.define([
    "dasa/custom/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("dasa.custom.controller.Overview", {
        onInit: function () {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("overview").attachPatternMatched(this._onObjectMatched, this);

            let oPdfModel = new JSONModel({
                url: ''
            });
            this.setModel(oPdfModel, "pdfModel");

            this.setModel(new JSONModel({
                busy: true,
                delay: 0
            }), "pageView");
        },

        _onObjectMatched: function () {
            let oViewModel = this.getModel('pageView'),
                iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
            
            let fnSetAppNotBusy = function () {
                oViewModel.setProperty("/busy", false);
                oViewModel.setProperty("/delay", iOriginalBusyDelay);
            };

            let fnLoadFormOnScreen = function () {
                this.getOwnerComponent().pCurrentEmployee.then(
                    function (oEmployee) {
                        let oDataModel = this.getModel();
                        oDataModel.read("/TermoCodCondutaSet('" + oEmployee.Pernr + "')", {
                            success: function (oData) {
                                let sUrl = oData.Url;

                                if (sap.ui.Device.browser.name === 'ie' && sap.ui.Device.browser.version < 10) {
                                    window.open(sUrl);
                                } else {
                                    let oPdfModel = this.getModel('pdfModel');
                                    oPdfModel.setData({
                                        content: '<div style="height: 100%;"><iframe src="' + sUrl + '" width="100%" height="100%" frameborder="0"></iframe></div>'
                                    });
                                }

                                let msg = 'Sua assinatura foi registrada eletronicamente com o seu login.';
                                MessageToast.show(msg, {
                                    duration: 7000,
                                    at: sap.ui.core.Popup.Dock.CenterTop
                                });

                                fnSetAppNotBusy();
                            }.bind(this),
                            error: function (oError) {
                                let oGeneralModel = this.getOwnerComponent().getModel("general"),
                                    oData = oGeneralModel.getData();

                                oData.abortServiceMessage = true;

                                let sMsg = JSON.parse(oError.responseText).error.message.value;
                                MessageBox.information(
                                    sMsg,
                                    {
                                        styleClass: this.getOwnerComponent().getContentDensityClass()
                                    }
                                );
                                fnSetAppNotBusy();
                            }.bind(this)
                        });
                    }.bind(this)
                );
            }.bind(this)

            this.getOwnerComponent().getModel().metadataLoaded().then(fnLoadFormOnScreen);
        }
    });
});