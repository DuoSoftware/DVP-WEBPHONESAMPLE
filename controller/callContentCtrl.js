/**
 * Created by Rajinda on 4/6/2016.
 */

'use strict'
routerApp.controller('callContentCtrl', function ($rootScope, $scope, $state, dataParser, socketAuth, Notification) {


    var onEventsListener = function (e) {
        console.info(e.type);
        //document.getElementById("lblStatus").innerHTML = e.type;
        Notification.info({message: e.type, delay: 500, closeOnClick: true});
    };

    var onSipEventSession = function (e) {
        try {
            //document.getElementById("lblSipStatus").innerHTML = e;
            Notification.info({message: e, delay: 500, closeOnClick: true});
            if (e.type == 'Session Progress') {
                //document.getElementById("lblSipStatus").innerHTML = 'Session Progress';
                //document.getElementById("lblStatus").innerHTML = 'Session Progress';
                Notification.info({message: 'Session Progress', delay: 500, closeOnClick: true});
            }
        }
        catch (ex) {
            console.error(ex.message);
        }
    };


    var fullScreen = function (b_fs) {
        bFullScreen = b_fs;
        if (tsk_utils_have_webrtc4native() && bFullScreen && videoRemote.webkitSupportsFullscreen) {
            if (bFullScreen) {
                videoRemote.webkitEnterFullScreen();
            }
            else {
                videoRemote.webkitExitFullscreen();
            }
        }
        else {
            if (tsk_utils_have_webrtc4npapi()) {
                try {
                    if (window.__o_display_remote) window.__o_display_remote.setFullScreen(b_fs);
                }
                catch (e) {
                    document.getElementById("divVideo").setAttribute("class", b_fs ? "full-screen" : "normal-screen");
                }
            }
            else {
                document.getElementById("divVideo").setAttribute("class", b_fs ? "full-screen" : "normal-screen");
            }
        }
    };

    var onErrorCallback = function (e) {
        //document.getElementById("lblStatus").innerHTML = e;
        Notification.error({message: e, delay: 500, closeOnClick: true});
        console.error(e);
        //$state.go('register');
    };
    var uiOnConnectionEvent = function (b_connected, b_connecting) {
        try {
            if (!b_connected && !b_connecting)$state.go('register');

            document.getElementById("btnCall").disabled = !(b_connected && tsk_utils_have_webrtc() && tsk_utils_have_stream());
            document.getElementById("btnAudioCall").disabled = document.getElementById("btnCall").disabled;
            document.getElementById("btnHangUp").disabled = !oSipSessionCall;
        }
        catch (ex) {
            console.error(ex.message);
        }
    };
    var uiVideoDisplayShowHide = function (b_show) {
        if (b_show) {
            document.getElementById("divVideo").style.height = '340px';
            document.getElementById("divVideo").style.height = navigator.appName == 'Microsoft Internet Explorer' ? '100%' : '340px';
        }
        else {
            document.getElementById("divVideo").style.height = '0px';
            document.getElementById("divVideo").style.height = '0px';
        }
        //btnFullScreen.disabled = !b_show;
    };

    var uiVideoDisplayEvent = function (b_local, b_added) {
        var o_elt_video = b_local ? videoLocal : videoRemote;

        if (b_added) {
            o_elt_video.style.opacity = 1;
            uiVideoDisplayShowHide(true);
        }
        else {
            o_elt_video.style.opacity = 0;
            fullScreen(false);
        }
    };


    var onIncomingCall = function (sRemoteNumber) {
        try {
            //document.getElementById("lblSipStatus").innerHTML = sRemoteNumber;
            Notification.info({message: sRemoteNumber, delay: 500, closeOnClick: true});
            inIncomingState();
        }
        catch (ex) {
            console.error(ex.message);
        }
    };

    var uiCallTerminated = function (msg) {
        try {
            /*
             btnHangUp.value = 'HangUp';
             btnHoldResume.value = 'hold';
             btnMute.value = "Mute";
             */
            inIdleState();
            if (window.btnBFCP) window.btnBFCP.disabled = true;


            stopRingbackTone();
            stopRingTone();

            //document.getElementById("lblSipStatus").innerHTML = msg;
            Notification.info({message: msg, delay: 500, closeOnClick: true});
            uiVideoDisplayShowHide(false);
            //document.getElementById("divCallOptions").style.opacity = 0;


            uiVideoDisplayEvent(false, false);
            uiVideoDisplayEvent(true, false);

            //setTimeout(function () { if (!oSipSessionCall) txtCallStatus.innerHTML = ''; }, 2500);
        }
        catch (ex) {
            console.error(ex.message)
        }
    };

    var notificationEvent = function (description) {
        try {
            //document.getElementById("lblStatus").innerHTML = description;
            Notification.info({message: description, delay: 500, closeOnClick: true});
            if (description == 'Connected') {
                document.getElementById("phoneButtons").style.visibility = 'visible';
                Notification.success({message: description, delay: 3000, closeOnClick: true});

            }
            else if (description == 'Forbidden') {
                console.error(description);
                Notification.error({message: description, delay: 3000, closeOnClick: true});
                $state.go('register');
            }
        }
        catch (ex) {
            console.error(ex.message);
        }

    };

    var inCallState = function () {
        document.getElementById("btnAudioCall").disabled = true;
        document.getElementById("btnCall").disabled = true;
        document.getElementById("phoneIncomingButtons").style.visibility = "hidden";
        document.getElementById("btnHangUp").disabled = false;
        document.getElementById("btnReject").style.visibility = "hidden";
    };

    var inIdleState = function () {
        document.getElementById("btnAudioCall").disabled = false;
        document.getElementById("btnCall").disabled = false;
        document.getElementById("phoneIncomingButtons").style.visibility = "hidden";
        document.getElementById("btnHangUp").disabled = true;
        document.getElementById("btnReject").style.visibility = "hidden";
    };

    var inIncomingState = function () {
        document.getElementById("btnAudioCall").disabled = true;
        document.getElementById("btnCall").disabled = true;
        document.getElementById("phoneIncomingButtons").style.visibility = "visible";
        document.getElementById("btnHangUp").disabled = true;
        document.getElementById("btnReject").style.visibility = "visible";
    };

    $scope.answerCall = function () {
        inCallState();
        answerCall();
    };
    $scope.rejectCall = function () {
        rejectCall();
    };

    $scope.makeCall = function (call) {
        inCallState();
        sipCall('call-audio', call.number);

    };

    $scope.makeVideoCall = function (call) {
        inCallState();
        sipCall('call-audiovideo', call.number);
    };

    $scope.hangUp = function () {
        sipHangUp();
    };

    $scope.sipSendDTMF = function (dtmf) {
        sipSendDTMF(dtmf);
    };

    var C =
    {
        divKeyPadWidth: 220
    };

    $scope.openKeyPad = function () {
        document.getElementById("divKeyPad").style.visibility = 'visible';
        document.getElementById("divKeyPad").style.left = ((document.body.clientWidth - C.divKeyPadWidth) >> 1)
            + 'px';
        document.getElementById("divKeyPad").style.top = '70px';
        document.getElementById("divKeyPad").style.visibility = 'visible';
    };

    $scope.closeKeyPad = function () {
        document.getElementById("divKeyPad").style.left = '0px';
        document.getElementById("divKeyPad").style.top = '0px';
        document.getElementById("divKeyPad").style.visibility = 'hidden';
        document.getElementById("divKeyPad").style.visibility = 'hidden';
    };

    $scope.unRegister = function () {
        sipUnRegister();
    };

    document.getElementById("phoneButtons").style.visibility = 'hidden';

    angular.element(document).ready(function () {
        inIdleState();
        if (angular.isDefined($rootScope.login)) {

            var userEvent = {
                onSipEventSession: onSipEventSession,
                notificationEvent: notificationEvent,
                onErrorCallback: onErrorCallback,
                uiOnConnectionEvent: uiOnConnectionEvent,
                uiVideoDisplayShowHide: uiVideoDisplayShowHide,
                uiVideoDisplayEvent: uiVideoDisplayEvent,
                onIncomingCall: onIncomingCall,
                uiCallTerminated: uiCallTerminated
            };
            socketAuth.getAuthenticatedAsPromise();// connect to notification server
            preInit(userEvent, dataParser.userProfile);// initialize Soft phone

        }
        else {
            console.error("Document Ready-login fails");
            // $state.go('register');
        }

    });
});