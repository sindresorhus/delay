'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CancelError = function (_Error) {
	_inherits(CancelError, _Error);

	function CancelError(message) {
		_classCallCheck(this, CancelError);

		var _this = _possibleConstructorReturn(this, (CancelError.__proto__ || Object.getPrototypeOf(CancelError)).call(this, message));

		_this.name = 'CancelError';
		return _this;
	}

	return CancelError;
}(Error);

var createDelay = function createDelay(willResolve) {
	return function (ms, value) {
		var timeoutId = void 0;
		var internalReject = void 0;

		var delayPromise = new Promise(function (resolve, reject) {
			internalReject = reject;

			timeoutId = setTimeout(function () {
				var settle = willResolve ? resolve : reject;
				settle(value);
			}, ms);
		});

		delayPromise.cancel = function () {
			if (timeoutId) {
				clearTimeout(timeoutId);
				timeoutId = null;
				internalReject(new CancelError('Delay canceled'));
			}
		};

		return delayPromise;
	};
};

module.exports = createDelay(true);
module.exports.reject = createDelay(false);
module.exports.CancelError = CancelError;