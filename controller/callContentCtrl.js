/**
 * Created by Rajinda on 4/6/2016.
 */

'use strict'
routerApp.controller('callContentCtrl', function ($rootScope, $scope, $state,$filter, dataParser, socketAuth, Notification) {

    var onEventsListener = function (e) {
        console.info(e.type);
        //document.getElementById("lblStatus").innerHTML = e.type;
        //Notification.info({message: e.type, delay: 500, closeOnClick: true});
    };

    var onSipEventSession = function (e) {
        try {
            $scope.call.status = e;
            //document.getElementById("lblSipStatus").innerHTML = e;
            //Notification.info({message: e, delay: 500, closeOnClick: true});
            if (e == 'Session Progress') {
                //document.getElementById("lblSipStatus").innerHTML = 'Session Progress';
                //document.getElementById("lblStatus").innerHTML = 'Session Progress';
                //Notification.info({message: 'Session Progress', delay: 500, closeOnClick: true});
            }
            else if (e.toString().toLowerCase() == 'in call') {
                inCallConnectedState();

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
        $state.go('register');
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
            //Notification.info({message: sRemoteNumber, delay: 500, closeOnClick: true});
            inIncomingState();
            $scope.call.number = sRemoteNumber;
            addCallToHistory(sRemoteNumber, 2);
        }
        catch (ex) {
            console.error(ex.message);
        }
    };

    var uiCallTerminated = function (msg) {
        try {
            UIStateChange.disableTimer();
            inIdleState();
            if (window.btnBFCP) window.btnBFCP.disabled = true;


            stopRingbackTone();
            stopRingTone();

            //document.getElementById("lblSipStatus").innerHTML = msg;
            //Notification.info({message: msg, delay: 500, closeOnClick: true});
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
            //Notification.info({message: description, delay: 500, closeOnClick: true});

            if (description == 'Connected') {
                inIdleState();
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

    var inCallConnectedState = function () {
        UIStateChange.enableTimer();
        UIelementOption.isCallConnect = true;
    };

    var inCallState = function () {
        UIStateChange.changeCallBtnState(false);
        UIStateChange.changeVideoCall(false);
        UIStateChange.changeEndCallBtnState(true);
        UIStateChange.ChangeEnableIncomingCallState(false);
        UIStateChange.changeCallHistoryState(false);
        UIStateChange.changeEnableKeyPadState(false);
        UIStateChange.changeEnableOutGoingState(true);
    };

    var inIdleState = function () {
        UIStateChange.loadInit(true);
        UIStateChange.ChangeEnableIncomingCallState(false);
        UIStateChange.changeCallHistoryState(false);
        UIStateChange.changeCallBtnState(true);
        UIStateChange.changeVideoCall(true);
        UIStateChange.changeEnableKeyPadState(true);
        UIStateChange.changeEndCallBtnState(false);

    };

    var inIncomingState = function () {
        UIStateChange.changeCallBtnState(false);
        UIStateChange.changeVideoCall(false);
        UIStateChange.changeEndCallBtnState(false);
        UIStateChange.ChangeEnableIncomingCallState(true);

    };

    $scope.answerCall = function () {
        inCallState();
        answerCall();
    };
    $scope.rejectCall = function () {
        rejectCall();
    };


    $scope.sipSendDTMF = function (dtmf) {
        sipSendDTMF(dtmf);
    };


    var openKeyPad = function () {

    };

    openKeyPad();

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
        UIStateChange.loadInit(false);
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

            $state.go('register');
        }

    });

    $scope.call = {};
    $scope.call.status = "";
    $scope.call.number = "";

    //code update #damith
    //#keypad option
    //call state
    // 0  miss call , 1 outgoing , 2 incoming
    $scope.callHistoryes = [{
        "id": 1, "number": "Veery", "date": $filter('date')(new Date(),'dd-MM-yyyy'), "time":$filter('date')(new Date(),'HH:mm'), "state": 0
    }];



    var addCallToHistory = function (number, state) {
        var dateOut = new Date();
        var date = $filter('date')(dateOut,'dd-MM-yyyy');
        var time = $filter('date')(dateOut,'HH:mm');
        var id = $scope.callHistoryes.length+1;
        var item = {
            "id": id, "number": number, "date": date, "time": time, "state": state
        };
        $scope.callHistoryes.push(item);
    };


    var UIelementOption = {
        isLoadingHistory: false,
        isCallHistory: false,
        isOpenKeyPad: false,
        isOutGoingCall: false,
        isCallConnect: false,
        isIncomingCall: false,
        isVideoCall: false,
        isTimer: false,
        isCallBtn: false,
        isAnzBtn: false,
        isEndCallBtn: false,
        isMicrophoneBtn: false,
        isKeyPadBtn: false,
        isVideoCallBtn: false,
        isChangeBtnWrap: false,
        callFunctions: false
    };

    $scope.UIelementOption = UIelementOption;


    //#UIstate change state

    //#UI change state
    var UIStateChange = (function () {
        return {
            changeCallHistoryState: function (state) {
                $scope.UIelementOption.isCallHistory = state;
                $scope.UIelementOption.isOpenKeyPad = false;
                $scope.UIelementOption.isOutGoingCall = false;
                $scope.UIelementOption.isIncomingCall = false;
                $scope.UIelementOption.isVideoCall = false;
            },
            changeEnableKeyPadState: function (state) {
                $scope.UIelementOption.isOpenKeyPad = state;
                $scope.UIelementOption.isCallHistory = false;
                $scope.UIelementOption.isOutGoingCall = false;
                $scope.UIelementOption.isIncomingCall = false;
                $scope.UIelementOption.isVideoCall = false;
            },
            changeEnableOutGoingState: function (state) {
                $scope.UIelementOption.isOutGoingCall = state;
                $scope.UIelementOption.isOpenKeyPad = false;
                $scope.UIelementOption.isCallHistory = false;
                $scope.UIelementOption.isIncomingCall = false;
                $scope.UIelementOption.isVideoCall = false;
            },
            ChangeEnableIncomingCallState: function (state) {
                $scope.UIelementOption.isIncomingCall = state;
                $scope.UIelementOption.isOutGoingCall = false;
                $scope.UIelementOption.isOpenKeyPad = false;
                $scope.UIelementOption.isCallHistory = false;
                $scope.UIelementOption.isVideoCall = false;
                $scope.UIelementOption.callFunctions = !state;
            },
            loadInit: function (state) {
                $scope.UIelementOption.isIncomingCall = state;
                $scope.UIelementOption.isOutGoingCall = state;
                $scope.UIelementOption.isOpenKeyPad = state;
                $scope.UIelementOption.isCallHistory = state;
                $scope.UIelementOption.isVideoCall = state;

            },
            refreshAllUI: function () {
                $scope.UIelementOption.isIncomingCall = false;
                $scope.UIelementOption.isOutGoingCall = false;
                $scope.UIelementOption.isOpenKeyPad = false;
                $scope.UIelementOption.isCallHistory = true;
                $scope.UIelementOption.isVideoCall = false;
            },
            enableTimer: function () {
                $scope.$broadcast('timer-start');
                $scope.UIelementOption.isTimer = true;
            },
            disableTimer: function () {
                $scope.$broadcast('timer-stop');
                $scope.UIelementOption.isTimer = false;
            },
            changeCallBtnState: function (state) {
                $scope.UIelementOption.isCallBtn = state;
            },
            changeEndCallBtnState: function (state) {
                $scope.UIelementOption.isEndCallBtn = state;
            },
            changeAnzCall: function (state) {
                $scope.UIelementOption.isAnzBtn = state;
            },
            changeVideoCall: function (state) {
                $scope.UIelementOption.isVideoCallBtn = state;
            },
            disableBtnArea: function () {

            }
        }
    })();//end


    var mainFunction = (function () {
        return {


            endCall: function () {
                $scope.UIelementOption.isCallConnect = false;
                $scope.UIelementOption.isOutGoingCall = false;
                $scope.UIelementOption.isCallHistory = true;
                $scope.UIelementOption.isOpenKeyPad = false;

                sipHangUp();
            },
            outGoingCall: function (call) {
                if(call.number == "")
                {
                    return
                }
                $scope.UIelementOption.isCallHistory = false;
                $scope.UIelementOption.isOpenKeyPad = false;
                if ($scope.UIelementOption.isOutGoingCall) {
                    $scope.UIelementOption.isOutGoingCall = false;
                    $scope.UIelementOption.isCallHistory = true;
                } else {
                    $scope.UIelementOption.isOutGoingCall = true;
                    $scope.UIelementOption.isCallHistory = false;
                    UIStateChange.changeEnableOutGoingState(true);
                }
                inCallState();
                sipCall('call-audio', call.number);
                addCallToHistory(call.number, 1);
            },
            makeVideoCall: function (call) {
                if(call.number == "")
                {
                    return
                }
                inCallState();
                sipCall('call-audiovideo', call.number);
                addCallToHistory(call.number, 1);
            },
            onClickIncomingCall: function () {
            },
            onAnswerCall: function () {
                inCallState();
                answerCall();
            },
            onRejectCall: function () {
                rejectCall();
            }
        }
    })();

    $scope.sipSendDTMF = function (dtmf) {
        sipSendDTMF(dtmf);
    };

    $scope.eventHandler = {
        onClickKeyPad: function () {
            if (UIelementOption.isCallConnect) {
                if ($scope.UIelementOption.isOpenKeyPad) {
                    $scope.UIelementOption.isOpenKeyPad = false;
                    $scope.UIelementOption.isOutGoingCall = true;
                }
                else {
                    $scope.UIelementOption.isOpenKeyPad = true;
                    $scope.UIelementOption.isOutGoingCall = false;
                }
            }
            else {
                if (UIelementOption.isCallHistory) {
                    $scope.UIelementOption.isCallHistory = false;
                    $scope.UIelementOption.isOpenKeyPad = true;
                    $scope.UIelementOption.isOutGoingCall = false;

                } else {
                    $scope.UIelementOption.isCallHistory = true;
                    $scope.UIelementOption.isOpenKeyPad = false;
                    $scope.UIelementOption.isOutGoingCall = false;

                }
            }
        },
        onClickOutGoingCall: function (call) {
            mainFunction.outGoingCall(call);
        },
        onClickEndCall: function () {
            mainFunction.endCall();
        },
        onClickVideoCall: function (call) {
            mainFunction.makeVideoCall(call);
        },
        onClickIncomingCall: function () {

        },
        onAnswerCall: function () {
            mainFunction.onAnswerCall();
        },
        onRejectCall: function () {
            mainFunction.onRejectCall();
        }
    }


}).directive('noClick', function () {
    return {
        restrict: 'EA',
        replace: true,
        link: function (scope, element, attrs) {
            var clickingCallback = function () {
                var soundUrl = 'assets/audio/135691_2465261.mp3';
                var sound = new Audio(soundUrl);
                sound.play();
                setTimeout(function () {
                    sound.pause();
                }, 120);
            };
            element.bind('click', clickingCallback);
        }
    };
});