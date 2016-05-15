/**
 * Image url
 * @typedef {String} Url
 */

/**
 * Diff mode
 * @typedef {String} Mode - difference | fade | swipe
 */

/**
 * Float number
 * @typedef {Number} Float
 */

// jquery4
var $ = function querySelector(domElem, selector) {
  if (arguments.length < 2) {
    selector = domElem;
    domElem = document;
  }
  return domElem.querySelector(selector);
};

/**
 * @class ImageDiff
 */
var ImageDiff = function () {
  /**
   * Init ImageDiff, load new images, set diff mode
   * @param {HTMLElement} domElem - ImageDiff instance (.image-diff)
   * @param {Url} before
   * @param {Url} after
   * @param {Mode} mode
   * @public
   * @constructor
   */
  function ImageDiff(domElem, before, after, mode) {
    this.domElems = {
      before: $(domElem, '.image-diff__before img'),
      after: $(domElem, '.image-diff__after img'),
      beforeWrapper: $(domElem, '.image-diff__before'),
      afterWrapper: $(domElem, '.image-diff__after'),
      wrapper: $(domElem, '.image-diff__wrapper'),
      inner: $(domElem, '.image-diff__inner'),
      self: domElem
    }

    this.domElems.before.onload=this._handleImgLoad();
    this.domElems.after.onload=this._handleImgLoad();

    this.update(before, after, mode);
  }

  ImageDiff.modes = ['difference', 'fade', 'swipe'];

  ImageDiff.getDefaultProps = function getDefaultProps() {
    return {
      value: 1,
      width: 0, height: 0,
      after: {width:0,height:0,url:''},
      before: {width:0,height:0, url:''},
      mode: 'difference' // ImageDiff.modes
    };
  };

  // default props
  ImageDiff.prototype.props = ImageDiff.getDefaultProps();

  /**
   * load new images or change diff mode
   * @param {Url} before
   * @param {Url} after
   * @param {Mode} mode
   * @public
   */
  ImageDiff.prototype.update = function update(before, after, mode) {
    this.props = ImageDiff.getDefaultProps();

    this.props.before.url = before;
    this.props.after.url = after;

    this.domElems.before.src = before;
    this.domElems.after.src = after;

    this._initMode(mode);
  };

  /**
   * @param {Float} value - 0..1
   * @public
   */
  ImageDiff.prototype.swipe = function swipe(value) {
    this._updateValue('swipe', value);
    this.domElems.wrapper.style.width = (this.props.width * (1. - value)) + 'px';
  };

  /**
   * @param {Float} value - 0..1
   * @public
   */
  ImageDiff.prototype.fade = function fade(value) {
    this._updateValue('fade', value);
    this.domElems.wrapper.style.opacity = 1. - value;
  };

  /**
   * @param {Float} value - 0..1
   * @public
   */
  ImageDiff.prototype.tune = function tune(value) {
    this._updateValue(null, value);
  };

  ImageDiff.prototype._updateValue = function _updateValue(mode, value) {
    if (value < 0-1e-6 || value > 1.+1e-6) {
      throw mode + ' value must be within 0..1, but given:' + value;
    }
    if (mode && this.props.mode !== mode) {
      throw 'current diff mode is ' + this.props.mode + ', not ' + mode;
    }
    if (this.props.mode === 'difference') {
      throw 'current diff mode (' + this.props.mode + ') is not tunable';
    }
    this.props.value = value;
  };

  ImageDiff.prototype._initSize = function _initSize(width, height) {
    // Размеры могут прийти раньше от первой или от второй картинки.
    // Повторное обновление не требется.
    // При загрузке новых картинок делается сброс размеров.
    if (this.props.width && this.props.height) {
      return;
    }

    this.props.width = width;
    this.props.height = height;

    (function initDomElems(argument) {
      var _this = this;
      var sizes = {width:width, height:height};

      Object.keys(sizes).forEach(function(key) {
        var val = sizes[key];
        ['afterWrapper', 'beforeWrapper', 'wrapper', 'inner', 'self'].forEach(function (elem) {
          _this.domElems[elem].style[key] = val + 'px';
        });
      });
    }).call(this);
  };

  ImageDiff.prototype._initMode = function _initMode(mode) {
    if (!ImageDiff.modes.includes(mode)) {
      throw 'Given mode «' + mode + '» not contained in collection ' + ImageDiff.modes;
    }
    this.props.mode = mode;
    this.domElems.inner.className = 'image-diff__inner image-diff__inner--' + mode;
    this.domElems.wrapper.style.opacity = 1;
    this.domElems.wrapper.style.width = this.props.width;
  };

  ImageDiff.prototype._handleImgLoad = function _handleImgLoad() {
    var _this = this;

    return function () {
      var img = this;
      _this._initSize(img.width, img.height);
    };
  };

  return ImageDiff;
}();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageDiff;
} else if (window) {
  window.ImageDiff = ImageDiff;
}
